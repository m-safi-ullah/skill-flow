import Products from "../models/Product.js";
import Profile from "../models/profile.js";

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { priceRange, search } = req.query;

    const filters = {};

    // Price filter
    if (priceRange && priceRange.toLowerCase() !== "all") {
      let [minPrice, maxPrice] = [0, Infinity];
      if (priceRange === "1000+") {
        minPrice = 1000;
      } else {
        [minPrice, maxPrice] = priceRange.split("-").map(Number);
      }
      filters.price = { $gte: minPrice, $lte: maxPrice };
    }

    // Search filter
    if (search?.trim()) {
      const q = search.trim();
      filters.$or = [
        { name: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    // Fetch products
    const products = await Products.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Products.countDocuments(filters);

    // Fetch usernames from Profile using email
    const enrichedProducts = await Promise.all(
      products.map(async (product) => {
        const profile = await Profile.findOne({
          email: product.email,
          role: "seller",
        });
        return {
          ...product.toObject(),
          username: profile?.username || "Unknown",
        };
      })
    );

    return res.status(200).json({
      success: true,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      limit,
      products: enrichedProducts,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
