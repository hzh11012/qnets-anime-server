const prisma = require('@core/prisma');

class VideoCommentDao {
    static async delete(id) {
        return await prisma.videoComment.delete({where: {id}});
    }

    static async findById(id) {
        return await prisma.videoComment.findUnique({where: {id}});
    }

    static async decrementLikeCount(id) {
        return await prisma.videoComment.update({
            where: {id},
            data: {likeCount: {decrement: 1}}
        });
    }

    static async incrementLikeCount(id) {
        return await prisma.videoComment.update({
            where: {id},
            data: {likeCount: {increment: 1}}
        });
    }

    static async incrementReplyCount(id) {
        return await prisma.videoComment.update({
            where: {id},
            data: {replyCount: {increment: 1}}
        });
    }

    static async decrementReplyCount(id) {
        return await prisma.videoComment.update({
            where: {id},
            data: {replyCount: {decrement: 1}}
        });
    }

    static async list({where, skip, take, orderBy, include, omit}) {
        const [total, rows] = await Promise.all([
            prisma.videoComment.count({where}),
            prisma.videoComment.findMany({
                where,
                skip,
                take,
                orderBy,
                include,
                omit
            })
        ]);
        return {rows, total};
    }

    static async update(id, data) {
        return await prisma.videoComment.update({
            where: {id},
            data
        });
    }
}

module.exports = VideoCommentDao;
