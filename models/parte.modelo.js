import { model, Schema } from 'mongoose';

const ParteSchema = new Schema(
  {
    usuario: {
      type: Schema.Types.ObjectId,
      ref: "usuarioModelo",
      required : true
    },
    fecha: {
      type: Date,
      default: Date.now()
    },
    cambioInicial:{
      type: String,
      required : true
    },
    distribuidor: [ 
      {
      nombre: {
        type: Schema.Types.ObjectId,
        ref: "distribuidorModelo",
        required : true
      },
      nota: {
        type: String,
      },
      familiasParticipantes: {
        type: Number,
      },
      stock: [{
        producto: {
          type: Schema.Types.ObjectId,
          ref: "productoModelo",
          required : true
        },
        stockInicial: {
          type: Number,
          required : true
        }, 
        stockFinal: {
          type: Number,
          required : true
        }, 
        precioProducto: {
          type: Number,
          required : true
        }, 
        totalRecaudado: {
          type: Number,
          required : true
        },
      }],
      prodmasvendido: {
        type: Schema.Types.ObjectId,
          ref: "productoModelo",
          required : true
      },
    }
  ],
    recaudacionTotal: {
      type: Number,
      required : true
    },
    ubicacion:{
      type: Schema.Types.ObjectId,
      ref: "PuntoModelo",
      required : true
    },
    estado: {
      type: Boolean,
      default: true
    }
  }
);
 
ParteSchema.methods.toJSON = function () {
  const { __v, estado, _id, ...data } = this.toObject();
  data.uid = _id;
  return data;
};

export default model("parteModelo", ParteSchema);