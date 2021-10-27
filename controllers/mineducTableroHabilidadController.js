const { UnidadMineduc, 
    MineducTableroHabilidad, 
    UnidadMineducHabilidad, 
    Curso,
    sequelize,
} = require('../database/db');
const uuidv4 = require('uuid').v4;
const { QueryTypes } = require('sequelize');



exports.crearTableroHabilidad = async(req, res) => {

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

            const unidadMineducHabilidades = await UnidadMineducHabilidad.findAll({
                where:{
                    codigo_unidad_mineduc: codigoUnidadMineduc
                }
            }) 

            for(let unidadMineducHabilidad of unidadMineducHabilidades){

                const numeroHabilidad = unidadMineducHabilidad.numero_habilidad
                
                let mineducTableroHabilidades = await MineducTableroHabilidad.findOne({
                    where: {
                        rut_usuario: rut_usuario,
                        codigo_curso: codigo_curso,
                        numero_habilidad: numeroHabilidad,
                        codigo_unidad_mineduc: codigoUnidadMineduc
                    }
                })
                
                if(!mineducTableroHabilidades){
                
                    await MineducTableroHabilidad.create({
                        codigo: uuidv4(),
                        rut_usuario: rut_usuario,
                        codigo_curso: codigo_curso,
                        codigo_unidad_mineduc: codigoUnidadMineduc,
                        numero_habilidad: numeroHabilidad,
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


exports.listarHabilidadesUnidadMineduc = async(req, res) => {
    try{

        const {codigo_unidad_mineduc, rut_usuario, codigo_curso} = req.query;

        const unidadMineducTableroHabilidades = await sequelize.query(`
            SELECT mth.codigo, umh.numero_habilidad, umh.descripcion_habilidad, mth.codigo_estado, e.descripcion
            FROM mineduc_tablero_habilidades mth
            INNER JOIN unidades_mineduc_habilidades umh
            ON mth.codigo_unidad_mineduc = umh.codigo_unidad_mineduc
            AND mth.numero_habilidad = umh.numero_habilidad
            INNER JOIN estados e
            ON mth.codigo_estado = e.codigo
            WHERE mth.codigo_unidad_mineduc = '${codigo_unidad_mineduc}'
            AND mth.rut_usuario = '${rut_usuario}'
            AND mth.codigo_curso = '${codigo_curso}'
        `, { type: QueryTypes.SELECT })

        res.json({
            unidadMineducTableroHabilidades
        })

    } catch (error) {
        console.log(error);
        res.status(500).send({
            msg: "Hubo un error, por favor vuelva a intentar"
        });
    }
}


exports.cambiarEstadoHabilidadUnidadMineduc = async(req, res) => {

    try{
        const { codigo_habilidad, codigo_estado } = req.body;
        MineducTableroHabilidad.update({
            codigo_estado: codigo_estado
        },{
            where: {
                codigo: codigo_habilidad,
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

