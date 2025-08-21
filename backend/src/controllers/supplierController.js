import Supplier from '../models/Supplier.js';

export const getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find().sort({ createdAt: -1 });
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getSupplierById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createSupplier = async (req, res) => {
  try {
    const { name, email, phone, address, category, status = 'Active' } = req.body;

    const existingSupplier = await Supplier.findOne({ email });
    if (existingSupplier) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const supplier = new Supplier({
      name,
      email,
      phone,
      address,
      category,
      status
    });

    await supplier.save();

    res.json({
      success: true,
      data: supplier
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    if (updates.email && updates.email !== supplier.email) {
      const existingSupplier = await Supplier.findOne({ email: updates.email });
      if (existingSupplier) {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedSupplier
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findById(id);
    if (!supplier) {
      return res.status(404).json({ message: 'Supplier not found' });
    }

    await Supplier.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Supplier deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};