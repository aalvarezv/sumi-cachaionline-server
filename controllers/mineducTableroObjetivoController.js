const { UnidadMineduc, 
    MineducTableroObjetivo, 
    UnidadMineducObjetivo, 
    Curso,
    sequelize
} = require('../database/db');
const uuidv4 = require('uuid').v4;
const { QueryTypes } = require('sequelize');


exports.crearTableroObjetivos = async(req, res) => {

    try {
       
        const { rut_usuario, codigo_curso, codigo_unidad_mineduc } = req.body;


        const cursos = await Curso.findByPk(codigo_curso)
        const codigoNivelAcademico = cursos.codigo_nivel_academico

        const unidadesMineduc = await UnidadMineduc.findAll({
            where: {
                codigo_nivel_academico: codigoNivelAcademico,
                codigo: codigo_unidad_mineduc
            }
        });
        //recorro las unidadesMineducObjetivos
        for(let unidadMineduc of unidadesMineduc){

            
            let codigoUnidadMineduc = unidadMineduc.codigo

            const unidadMineducObjetivos = await UnidadMineducObjetivo.findAll({
                where:{
                    codigo_unidad_mineduc: codigoUnidadMineduc
                }
            }) 

            for(let unidadMineducObjetivo of unidadMineducObjetivos){

                const numeroObjetivo = unidadMineducObjetivo.numero_objetivo

                     
                let mineducTableroObjetivos = await MineducTableroObjetivo.findOne({
                    where: {
                        rut_usuario: rut_usuario,
                        codigo_curso: codigo_curso,
                        numero_objetivo: numeroObjetivo,
                        codigo_unidad_mineduc: codigoUnidadMineduc
                    }
                })
                
                if(!mineducTableroObjetivos){
                
                    await MineducTableroObjetivo.create({
                        codigo: uuidv4(),
                        rut_usuario: rut_usuario,
                        codigo_curso: codigo_curso,
                        codigo_unidad_mineduc: codigoUnidadMineduc,
                        numero_objetivo: numeroObjetivo,
                        codigo_estado: '4'
                    })
    
                }
            }  
            
        }

        res.json({
            unidadesMineduc
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
}

exports.listarObjetivosUnidadMineduc = async(req, res) => {

    try{
        
        const {codigo_unidad_mineduc, rut_usuario, codigo_curso} = req.query;
 
        const unidadMineducTableroObjetivos = await sequelize.query(`
            SELECT  mto.codigo, umo.numero_objetivo, umo.descripcion_objetivo, mto.codigo_estado, e.descripcion,
            mto.fecha_inicio, mto.fecha_termino
            FROM mineduc_tablero_objetivos mto
            INNER JOIN unidades_mineduc_objetivos umo
            ON mto.codigo_unidad_mineduc = umo.codigo_unidad_mineduc
            AND mto.numero_objetivo = umo.numero_objetivo
            INNER JOIN estados e
            ON mto.codigo_estado = e.codigo
            WHERE mto.codigo_unidad_mineduc = '${codigo_unidad_mineduc}'
            AND mto.rut_usuario = '${rut_usuario}'
            AND mto.codigo_curso = '${codigo_curso}'
            ORDER BY umo.numero_objetivo ASC
        `, { type: QueryTypes.SELECT })


        res.json({
            unidadMineducTableroObjetivos
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
}


exports.cambiarEstadoObjetivosUnidadMineduc = async(req, res) => {

    try{

        const { codigo_objetivo, codigo_estado } = req.body;
        MineducTableroObjetivo.update({
            codigo_estado: codigo_estado
        },{
            where: {
                codigo: codigo_objetivo,
            }
        })

        res.json({
            msg: 'Estado actualizado'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }

}


exports.actualizarFechasObjetivosUnidadMineduc = async(req, res) => {

    try{

        const { codigo_objetivo, fecha_inicio, fecha_termino } = req.body;
      
        if(fecha_inicio){
            await MineducTableroObjetivo.update({
                fecha_inicio: fecha_inicio
            },{
                where: {
                    codigo: codigo_objetivo,
                }
            })
        }

        if(fecha_termino){
            await MineducTableroObjetivo.update({
                fecha_termino: fecha_termino
            },{
                where: {
                    codigo: codigo_objetivo,
                }
            })
        }
       

        res.json({
            msg: 'Fechas actualizadas'
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }

}
