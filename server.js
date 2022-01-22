let modulo = require("./manejoArchivos")
const prod = new modulo.nombreExportacion("./productos.json");

const express = require('express');
const app = express();
const { Router } = require('express');
const router = Router();

//Middlewares
app.use('/api/productos', router);
app.use(express.json());
app.use(express.urlencoded({extended: false }));
app.use(express.static('public'));

//Endpoints
router.get('/', async (req,res) => {
    const a = await prod.getAll();
    res.send(a);
});

router.get('/:id', async (req,res) => {
    const {id} = req.params;
    const a = await prod.getById(id);
    if (a == null){
        res.json({ error : 'producto no encontrado'});
    } else {
        res.json(a);
    }
});

app.post('/index.html', async (req, res) => {
    const a = await req.body;
    console.log(a);
    const b = await prod.save(req.body);
    const c = await prod.getById(b);
    res.json(c);
  });


router.delete('/:id', async (req,res) =>{
    const {id} = req.params;
    const a = await prod.getById(id);
    if (a == null){
        res.json({ error : 'producto no encontrado'});
    } else {
        const b = await prod.deleteById(id);
        const c = await prod.getAll();
        res.json(c);
    }

});

app.put('/api/productos/:id', (req,res) =>{
    let id = req.params.id;
    console.log(id);
    let a = req.body;
    let b = a.title;
    let c = a.price;
    let d = a.thumbnail;
    console.log(a,b,c,d);
    const fs = require('fs');
    const jsonData = fs.readFileSync("productos.json");
    const data = JSON.parse(jsonData);
    console.log (data);
    for (element of data){
        if (element.id == id){
            element.title = b;
            element.price = c;
            element.thumbnail = d;
        }
    }
    fs.writeFileSync("productos.json", (JSON.stringify(data)));
    res.json(data);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});
