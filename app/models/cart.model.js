import mongoose from 'mongoose';

const cartSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref:'user',
    },
    items:[
        {
            productId:{
                Type: Schema.Types.ObjectId,
                ref:'product',
                required: true
            },
            quantity:{
                type: Number,
                required: true,
                default: 1,
                min:1
            },
            storeId:{
                type: Schema.Types.ObjectId,
                ref:'store',
                required: true
            },
            purcasePrice:{
                type: Number,
                required: true
            },
            image:{
                type: String,
                required: true,
            }
        }
    ]
})