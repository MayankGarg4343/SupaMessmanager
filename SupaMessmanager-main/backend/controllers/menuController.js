const Menu = require('../models/Menu');

const toDateOnly = (value) => {
  const d = new Date(value);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const updateMenu = async (req, res) => {
  try {
    const { date, breakfast, lunch, dinner } = req.body;
    const dateOnly = toDateOnly(date);

    const menu = await Menu.findOneAndUpdate(
      { date: dateOnly },
      { date: dateOnly, breakfast, lunch, dinner },
      { upsert: true, new: true }
    );

    res.status(201).json({ success: true, message: "Menu updated successfully!", menu });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Failed to update menu." });
  }
};

const getMenu = async (req, res) => {
  try {
    const dateOnly = toDateOnly(req.params.date);
    const menu = await Menu.findOne({ date: dateOnly });
    if (!menu) {
      return res.status(404).json({ success: false, message: "Menu not found for this date." });
    }
    res.json(menu);
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch menu." });
  }
};

module.exports = { updateMenu, getMenu };
