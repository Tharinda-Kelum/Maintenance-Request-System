const Department = require('../models/Department');

// Create Department / Sub-Department
exports.createDepartment = async (req, res) => {
  try {
    const { name, code, parentId, hodId } = req.body;
    
    const department = new Department({
      name,
      code,
      parentId: parentId || null,
      hodId: hodId || null
    });

    await department.save();
    res.status(201).json({ success: true, data: department });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Fetch Department Tree Structure
exports.getDepartmentTree = async (req, res) => {
  try {
    const departments = await Department.find().populate('parentId', 'name code').lean();

    // Transform to nested hierarchy
    const deptMap = {};
    departments.forEach((dept) => {
      dept.children = [];
      deptMap[dept._id] = dept;
    });

    const rootDepartments = [];
    departments.forEach((dept) => {
      if (dept.parentId) {
        if (deptMap[dept.parentId._id]) {
          deptMap[dept.parentId._id].children.push(dept);
        }
      } else {
        rootDepartments.push(dept);
      }
    });

    res.json({ success: true, data: rootDepartments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};