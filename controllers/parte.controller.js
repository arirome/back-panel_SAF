import parteModelo from "../models/parte.modelo.js";

// Devuelve todos los partes activas de la colección
export const getPartes = async (req, res) => {
  try {
    const partes = await parteModelo
      .find()
      .populate("usuario", ["nombre", "apellido", "img"]) // consulta para todos los documentos
      .populate("distribuidor.nombre", ["nombre"])
      .populate("ubicacion", ["nombre", "barrio"])
      .populate("distribuidor.stock.producto", ["nombre", "img"]);
    // Respuesta del servidor
    res.json(partes);
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};
 
export const getPartesPorFecha = async (req, res) => {
  const { fechapd } = req.params;
  console.log(fechapd)
  try {
    const partes = await parteModelo
      .find({fecha: fechapd})
      .populate("usuario", ["nombre", "apellido", "img"]) // consulta para todos los documentos
      .populate("distribuidor.nombre", ["nombre"])
      .populate("ubicacion", ["nombre", "barrio"])
      .populate("distribuidor.stock.producto", ["nombre", "img"]);
    // Respuesta del servidor
    res.json(partes);
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};

export const getPartesPorGrupos = async (req, res) => {

  const limit = parseInt(req.query.limit);
  const skip = parseInt(req.query.skip);

  let fechaInicio; 
  let fechaFinal; 
  var año = new Date().getFullYear();

  if(req.query.fechaInicio){
    fechaInicio = new Date(req.query.fechaInicio)
  }else{
    fechaInicio = new Date(`${año}/01/01`)
  }

  if(req.query.fechaFinal){
    fechaFinal = new Date(req.query.fechaFinal)
  }else{
    fechaFinal = new Date(`${año}/12/31`)
  }

  try {
    const partes = await parteModelo
      .find({
        fecha: {
          $gte: fechaInicio,
          $lt: fechaFinal
        }
      })
      .populate("usuario", ["nombre", "apellido", "img"]) // consulta para todos los documentos
      .populate("distribuidor.nombre", ["nombre"])
      .populate('ubicacion',[ "nombre", "barrio" ])
      .populate("distribuidor.stock.producto", ["nombre", "img"])
      .populate("distribuidor.prodmasvendido", ["nombre"])

      const totalPage = partes.length

    let datosParte = partes.slice(skip, skip + limit).reverse();
    //console.log(datosParte)

    // "data" es la variable que está alojando el JSON
    var datos;
    var partesDatos = [];
    
    for (let i = 0; i < datosParte.length; i++) {
      datos = datosParte[i];

      var parteAct;
      var parte = {};
      /* console.log(datos.fecha.toLocaleDateString("es-ES")) */
      // Revisa si la ciudad que que actualmente estamos leyendo difiere con la última leída
      if (parteAct !== datos.fecha.toLocaleDateString("es-ES")) {
        // Guarda la nueva ciudad en la variable correspondiente
        parteAct = datos.fecha.toLocaleDateString("es-ES");
        /* console.log(parteAct) */
        // Guarda en la propiedad "nombre" del objeto "ciudad" el valor de la propiedad "Ciudad"
        // del profesional que actualmente estamos evaluando
        parte.parte_fecha = datos.fecha;

        // Filtra el objeto "data" comparando la propiedad "Ciudad" de cada profesional con la ciudad actual
        parte.datos = datosParte.filter((item) => item.fecha.toLocaleDateString("es-ES") === parteAct);
        //onsole.log(parte)
        // Finalmente toma el objeto ciudad con todos los profesionales que le corresponden y lo guarda en el array "ciudades"
        partesDatos.push(parte);
      }
    }
    // Respuesta del servidor
    //console.log(partesDatos.length)
    res.json({totalPage,partesDatos});
  } catch (error) {
    console.log("Error al traer los partes: ", error);
  }
};

export const getPartesPorMes = async (req,res) => {
 
  
  let fechaInicio; 
  let fechaFinal; 
  var año = new Date().getFullYear();

  if(req.query.fechaInicio){
    fechaInicio = new Date(req.query.fechaInicio)
  }else{
    fechaInicio = new Date(`${año}/01/01`)
  }

  if(req.query.fechaFinal){
    fechaFinal = new Date(req.query.fechaFinal)
  }else{
    fechaFinal = new Date(`${año}/12/31`)
  }

const consulta = await parteModelo.find({
  fecha: {
    $gte: fechaInicio,
    $lt: fechaFinal
  }
})

res.json(consulta)
  /* parteModelo.find({
    $expr: {
      $eq: [{ $month: "$fecha" }, mes]
    }
  }, function(err, users) {
    console.log(users);
  }); */


}

// Controlador que almacena un nuevo parte
// CREAR PARTE
export const postParte = async (req, res) => {
  // Desestructuramos la información recibida del cliente

  const datos = req.body;
  datos.usuario = req.usuario._id;
  try {
    // Se alamacena el nuevo inventario en la base de datos
    const parte = new parteModelo(datos);
    await parte.save();

    res.json({ msg: "El parte se guardó correctamente" });
  } catch (error) {
    console.log("Error al crear el parte: ", error);
  }
};

// Controlador que actualiza un parte
// ACTUALIZAR PARTE
export const putParte = async (req, res = response) => {
  const { id } = req.params;
  const { usuario, ...data } = req.body;

  try {
    data.fecha;
    data.distribuidor;
    //console.log(data.fecha)
    data.usuario = req.usuario._id;
    //console.log(id)
    await parteModelo.findByIdAndUpdate(id, data, { new: true });

    res.json({ msg: "El parte se actualizó correctamente" });
  } catch (error) {
    console.log("Error al actualizar el parte: ", error);
  }
};
