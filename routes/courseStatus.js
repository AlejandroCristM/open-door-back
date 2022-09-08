import express from 'express';
import { PrismaClient } from '@prisma/client';

const courseStatus = express.Router();
const prisma = new PrismaClient();

/** 
 * @swagger
 * tags:
 *  name: Course Status
 *  description: Endpoint to patch a course
 */
/**
 * @swagger
 * paths:
 *  /course/status:
 *   patch:
 *      parameters:
 *          - in: params            
 *            name: courseId
 *            schema:
 *              type: string
 *            description: The id of the course to get
 *      summary: Get a specific course with all attributes and content
 *      tags: [Course Status]
 *      responses:
 *          200:
 *              description: It was possible to connect to the database and obtain the course           
 *              content:    
 *                  application/json:
 *                      schema:
 *                          properties:
 *                              title:
 *                                  type: string
 *                                  example: Habilidades para la vida
 *                              description:
 *                                  type: string
 *                                  example: Este curso enseña sobre habilidades para la vida
 *                              createAt:
 *                                  type: string
 *                                  example: 2022-12-13T23:59:59.SSSZ
 *                              courseContents:
 *                                  type: json
 *                                  example:
 *                                      name: Habilidades para la vida
 *                                      description: Documento que tiene las habilidades para la vida
 *                                      typeFile: pdf
 *                                      file: https://drive.google.com/uc?id=1K-xVrXnuQAbdELzzq1c7Y_PKECnImm5a&export=download
 *          
 *          204:
 *              description: No course with that Id, doesn't need to navigate away from its current page
 *              
 *          500:
 *              description: There was an unexpected error reaching connecting to the database
 *          
 */

 courseStatus.route('/course/status').patch(status());

function status() {
    return async (req, res) => {
        try {
            const {courseId, userId, statusCourse} = req.body;
            let course = await prisma.UserCourse.findMany({
                where: {
                        userId: userId,
                        courseId: courseId
                }
            });
            const date = Date.now();
            const finishDate = new Date(date);
            
            if(course.length != 0) {
                const updateCourse = await prisma.userCourse.update({
                    where: {
                        id: course[0].id
                    },
                    data: {
                        status: statusCourse,
                    }
                });
                res.status(200).json(updateCourse);
            } else {
                const newCourse = await prisma.userCourse.create({
                    data: {
                        userId: userId,
                        courseId: courseId,
                        status: statusCourse,
                        finishDate: "1970-01-01T00:00:00.000Z"
                    }
                });
                res.status(200).json(newCourse);
            }
        } catch {
            res.status(500).json({
                status: 'Unexpected error',
            })
        }
    }
}
export { courseStatus };