const { RingInvitacion } = require('./database/db')
const uuidv4 = require('uuid').v4;

exports.socketEvents = socket => {

    socket.on('enviar-invitacion-ring', async data => {
         
        
        try{
            //revisa si el receptor tiene una invitación para el ring.
            const ringInvitacion = await RingInvitacion.findOne({
                where: {
                    rut_usuario_receptor: data.receptor.rut,
                    codigo_ring: data.ring.codigo
                }
            })

            if(!ringInvitacion){
                await RingInvitacion.create({
                    codigo: uuidv4(),
                    codigo_ring: data.ring.codigo,
                    rut_usuario_emisor: data.remitente.rut,
                    rut_usuario_receptor: data.receptor.rut,
                    estado: 0,
                })
                socket.broadcast.emit(`recibir-invitacion-ring-${data.receptor.rut}`)
            }

        }catch(error){
            console.log(error)
        }

    })

    socket.on('cancelar-invitacion-ring', async data => {
        try{
            //revisa si el receptor tiene la invitación para el ring.
            const ringInvitacion = await RingInvitacion.findOne({
                where: {
                    rut_usuario_receptor: data.receptor.rut,
                    codigo_ring: data.ring.codigo
                },
                raw: true,
                nested: true,
            })
            //elimina la invitación
            await RingInvitacion.destroy({
                where:{
                    codigo: ringInvitacion.codigo
                }
            })

            socket.broadcast.emit(`cancelar-invitacion-ring-${data.receptor.rut}`)

        }catch(error){
            console.log(error)
        }

    })

    socket.on('aceptar-rechazar-invitacion-ring', async data => {
        
        try {
            
            await RingInvitacion.update({
                estado: data.estado,
            },{ 
                where: {
                    codigo: data.codigo
                }
            })

            socket.broadcast.emit(`aceptar-rechazar-invitacion-ring-${data.emisor.rut}`)
            
        } catch (error) {
            console.log(error)
        }

    })

}