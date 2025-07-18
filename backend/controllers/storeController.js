import User from "../models/userModel.js";

export const getAllStores = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      search = "",
      status,
    } = req.query;

    const query = { role: "shopowner" };

    //Search by shopName or shopownerName
    if (search) {
      query.$or = [
        { shopName: { $regex: search, $options: "i" } },
        { shopownerName: { $regex: search, $options: "i" } },
      ];
    }   

    // Filter by status (active/inactive)
    if (status) {
      query.status = status;
    }

    //  Total Count
    const totalStores = await User.countDocuments(query);

    //Fetch with pagination & sorting
    const stores = await User.find(query)
      .select(
        "shopName shopownerName email phone address shopImage status lastLogin createdAt"
      )
      .sort({ [sort]: order === "asc" ? 1 : -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      totalStores,
      currentPage: Number(page),
      totalPages: Math.ceil(totalStores / limit),
      stores,
    });
  } catch (error) {
    console.error("Error fetching stores:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch stores",
      error: error.message,
    });
  }
};
