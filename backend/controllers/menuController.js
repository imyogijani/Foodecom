import MenuItem from '../models/menuItemModel.js';

// Create a new menu item
export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category, image, isAvailable, isPremium } = req.body;

    const newMenuItem = new MenuItem({
      name,
      description,
      price,
      category,
      image,
      isAvailable,
      isPremium,
    });

    const savedMenuItem = await newMenuItem.save();
    res.status(201).json({ success: true, data: savedMenuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all menu items
export const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json({ success: true, data: menuItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a menu item
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image, isAvailable, isPremium } = req.body;

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      { name, description, price, category, image, isAvailable, isPremium },
      { new: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.status(200).json({ success: true, data: updatedMenuItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a menu item
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMenuItem = await MenuItem.findByIdAndDelete(id);

    if (!deletedMenuItem) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    res.status(200).json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};