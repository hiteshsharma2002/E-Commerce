const express = require("express");
const adminmong = require("../models/Mongo_admin");
const catmong = require("../models/Mongo_category");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const subcatmong = require("../models/Mongo_subcat");
const productmong = require("../models/Mongo_product");
const slidemong = require('../models/Mongo_Slides');
const reviewmong = require('../models/Mongo_review');

// ----------------------------------------- admin login

router.get("/adminLogin", function (req, res) {
  res.render("adminLogin");
});

router.post("/adminLogin", async (req, res) => {
  try {
    const { email, pass } = req.body;

    const exist = await adminmong.findOne({ email });

    console.log({email, pass, exist})

    if (!exist) {
      return res.send('<script>alert("No record found")</script>');
    } else if (exist.pass === pass) {
      req.session.adminEmail = { email: exist.email };

      return res.redirect(`/admin/dashboard`);
    } else {
      return res.send('<script>alert("Incorrect Password")</script>');
    }
  } catch (err) {
    return res.send(
      '<script>alert("An error occured while loging in...")</script>'
    );
  }
});

router.get("/dashboard", (req, res) => {
  if (!req.session.adminEmail) {
    res.render("adminLogin");
  } else {
    const { email } = req.session.adminEmail;

    res.render("dashboard", { email });
  }
});

// ----------------------------------------- add category

router.get("/category", (req, res) => {
  const { email } = req.session.adminEmail;
  res.render("category", { email });
});

// ----------------------------------------- multer category image

const mystorage = multer.diskStorage({
  destination: "./public/uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// ----------------------------------------- multer upload for category

const upload = multer({
  storage: mystorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const fileType = /jpg|jpeg|avif|png|webp/;
    const extname = fileType.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileType.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("File format not supported"));
    }
  },
});

router.post("/category", upload.single("image"), async (req, res) => {
  try {
    const { category } = req.body;

    const imagePath = `/uploads/${req.file.filename}`;

    const newCat = new catmong({
      category,
      image: imagePath,
    });

    await newCat.save();
    return res.send('<script>alert("New Category added")</script>');
  } catch (err) {
    return res.send('<script>alert("Unable to add category")</script>');
  }
});

// ----------------------------------------- manage category

// router.get("/manage-category", async (req, res) => {
//   try {
//     const data = await catmong.find();
//     const { email } = req.session.adminEmail;

//     res.render("manageCategory", { data, email });
//   } catch (err) {
//     res.send("error occured");
//   }
// });

// ----------------------------------------- manage category

router.get("/manage-category", async (req, res) => {
  try {
    const data = await catmong.find();
  
    // const { email } = req.session.adminEmail;

    // res.render("manageCategory", { data, email });
    res.json(data);
    // res.json(updatedimg);
  } catch (err) {
    // res.send("error occured");
    res.json('error')
  }
});

// ----------------------------------------- delete category

router.get("/delete/:id", async (req, res) => {
  try {
    await catmong.findByIdAndDelete(req.params.id);
    res.redirect("/admin/manage-category");
  } catch (err) {
    res.send("error occured");
  }
});

// ----------------------------------------- edit category

router.get("/edit/:id", async (req, res) => {
  try {
    const categorie = await catmong.findById(req.params.id);

    res.render("editCategory", { categorie });
  } catch (err) {
    res.send("An error occured while editing");
  }
});

// ----------------------------------------- update category

router.post("/edit/:id", async (req, res) => {
  try {
    const { category } = req.body;

    await catmong.findByIdAndUpdate(req.params.id, { category });
    res.redirect("/admin/manage-category");
  } catch (err) {
    res.send("An error occured while editing");
  }
});

// ----------------------------------------- sub category

router.get("/sub-cat", async (req, res) => {
  try {
    const cate = await catmong.find();
    const { email } = req.session.adminEmail;
    res.render("subcategory", { cate, email, success: null });
  } catch (err) {
    console.log(err);
  }
});

router.post("/sub-cat", async (req, res) => {
  try {
    const { category, product } = req.body;

    const newsub = new subcatmong({
      category,
      product,
    });

    const cate = await catmong.find();

    await newsub.save();
    res.render("subcategory", {
      cate,
      success: "Sub Category added successfully",
    });
  } catch (err) {
    res.send(err.message);
  }
});

// ----------------------------------------- manage sub category

router.get("/manage-sub-cat", async (req, res) => {
  try {
    const data = await subcatmong.find();
    res.render("managesubCat", { data });
  } catch (err) {
    res.send(err);
  }
});

router.get("/manage-sub-catapi", async (req, res) => {
  try {
    const data = await subcatmong.find();
    // console.log("Fetched Subcategory Data from DB:", data); 
    // res.render("managesubCat", { data });
    res.json(data);
  } catch (err) {
    // res.send(err);
    res.json(err);
  }
});


// ---------------------------------------- delete subcategory

router.get("/del/:id", async (req, res) => {
  try {
    await subcatmong.findByIdAndDelete(req.params.id);
    res.redirect("/admin/manage-sub-cat");
  } catch (err) {
    res.send(err);
  }
});

// -------------------------------------------- add product

router.get("/insert-product", async (req, res) => {
  const cate = await catmong.find();
  const data = await subcatmong.find();
  res.render("insertproduct", { cate, data, success: null });
});

const uploads = multer({
  storage: mystorage,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const filetype = /jpeg|jpg|avif|webp|png/;
    const extname = filetype.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetype.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error("File format not supported"));
    }
  },
});

router.post("/insert-product", uploads.array("image", 10), async (req, res) => {
  try {
    const { category, subcategory, product, price, discount, desc, avail } =
      req.body;

    const imagepath = req.files.map((file) => `/uploads/${file.filename}`);

    const newProduct = new productmong({
      category,
      subcategory,
      product,
      price,
      discount,
      desc,
      avail,
      image: imagepath,
    });

    await newProduct.save();

    const cate = await catmong.find();
    const data = await subcatmong.find();

    res.render("insertproduct", {
      cate,
      data,
      success: "Product inserted successfully",
    });
  } catch (err) {
    res.send(err);
  }
});

// --------------------------------------------- manage product

router.get("/manage-product", async (req, res) => {
  const product = await productmong.find();

  res.render("manageproduct", { product });
});


router.get("/manage-productapi", async (req, res) => {
  const product = await productmong.find();

  // res.render("manageproduct", { product });
  res.json(product);
});





// -------------------------------------------- delete product

router.get("/dell/:id", async (req, res) => {
  try {
    await productmong.findByIdAndDelete(req.params.id);
    res.redirect("/admin/manage-product");
  } catch (err) {
    res.send(err);
  }
});

// -------------------------------------------- edit product

router.get("/editt/:id", async (req, res) => {
  try {
    const product = await productmong.findById(req.params.id);

    const cate = await catmong.find();
    const data = await subcatmong.find();

    res.render("editproduct", { product, cate, data });
  } catch (err) {
    res.send("error occured");
  }
});

// ------------------------------------------ update product

router.post("/editt/:id", async (req, res) => {
  try {
    const { category, subcategory, product, price, desc, avail, discount } =
      req.body;

    await productmong.findByIdAndUpdate(req.params.id, {
      category,
      subcategory,
      product,
      price,
      desc,
      avail,
      discount,
    });

    res.redirect("/admin/manage-product");
  } catch (err) {
    res.send("cannot be edited at this time");
  }
});

// --------------------------------------- edit image

router.get("/edit-image/:imgid/:imgindex", async (req, res) => {
  try {
    const { imgid, imgindex } = req.params;

    const vehicleid = await productmong.findById(imgid);

    if (!vehicleid) {
      return res.send("Vehicle does not found");
    }

    const vehicleindex = vehicleid.image[imgindex];

    if (!vehicleindex) {
      return res.send("image not found");
    }

    res.render("editproductimage", { vehicleindex, imgid, imgindex });
  } catch (err) {
    res.send("error occured");
  }
});

router.post(
  "/edit-image/:imgid/:imgindex",
  upload.single("file"),
  async (req, res) => {
    try {
      const { imgid, imgindex } = req.params;
      const file = req.file;

      if (!file) {
        return res.send("no vehicle found");
      }

      const veh = await productmong.findById(imgid);

      if (!veh) {
        return res.send("no vehicle found");
      }

      if (!veh.image[imgindex]) {
        return res.send("no vehicle image found");
      }

      const newimagepath = `/uploads/${file.filename}`;
      veh.image[imgindex] = newimagepath;

      await veh.save();
      return res.send("image changed successfully");
    } catch (err) {
      res.send(err.message);
    }
  }
);

// ------------------------------------------------ delete image

router.get("/delete-image/:imgid/:imgindex", async (req, res) => {
  try {
    const { imgid, imgindex } = req.params;

    const deleted = await productmong.findById(imgid);

    if (!deleted) {
      res.send("cannot find vehicle");
    }

    deleted.image.splice(imgindex, 1);

    await deleted.save();

    const data = await subcatmong.find();
    const product = await productmong.find();
    const cate = await catmong.find();
    res.render("editproduct", { deleted, data, product, cate });
  } catch (err) {
    res.send(err);
  }
});

// ------------------------------------------ slider images

router.get('/slider',function (req,res) {
  res.render('slider');
})

router.get("/sliderapi", async (req, res) => {
  try {
    const data = await slidemong.find();

    res.json(data); 
  } catch (err) {
    res.json("error");
  }
});



const fileUpload = multer({
  storage: mystorage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter:(req,file,cb)=> {
    const fileType = /jpg|jpeg|avif|webp|gif|png/;
    const extname = fileType.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileType.test(file.mimetype);

    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Image format not supported'));
    }

  }
})



router.post('/slider',fileUpload.array('file',10),async (req,res) => {
  
  try {
    const filePath = req.files.map((file) => `/uploads/${file.filename}`);

    const newImg = new slidemong({
      file:filePath
    })

    await newImg.save();
    // res.send('image added successfully');

    res.json('Image added successfully');
  }
  catch (err) {
    // res.send(err);
    res.json('error');
  }

})

// ------------------------------------------ review

router.post('/review',async (req,res) => {
  try{
    const { name, review ,rating} = req.body;

    const newReview = new reviewmong({
      name,review,rating
    })

    await newReview.save();
    res.status(200).json({message:'Thanks for your feedback'});

  }
  catch (err) {
    res.json(err);
    // console.log(err.message);
  }
})

router.get('/review-details',async (req,res) => {
  try {
    const review = await reviewmong.find();

    res.json(review);
  }
  catch (err) {
    res.json(err);
  }
})


// ------------------------------------------ sign out

router.get('/signout', function (req, res) {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      return res.send('cannot logout');
    }
    res.render('adminLogin');
  })
  
})

module.exports = router;
