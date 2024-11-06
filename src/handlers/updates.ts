import prisma from "../db";

export const getUpdates = async (req, res) => {
    const products = await prisma.product.findMany({
        where: {
            belongsToId: req.user.id
        },
        include: {
            update: true
        }
    })

    const updates = products.reduce((allUpdates, product) => {
        return [...allUpdates, ...product.update]
    }, [])

    res.json({data: updates})
}


//Get one
export const getOneUpdate = async (req, res) => {
    const id = req.params.id

    const update = await prisma.update.findFirst({
        where: {
            id
        }
    })

    res.json({data: update})
}

export const createUpdate = async (req, res) => {

    const{productId, ...rest} = req.body

    const product =  await prisma.product.findUnique({
        where: {
            id: productId
        }
    })
    if(!product){
        //does not belong to user
        res.json({message: 'nope'})
    }

    const update = await prisma.update.create({
        data: {
            title: req.body.title,
            body: req.body.body,
            product: {connect: product}
        }
    })



    res.json({data: update})
}

export const updateUpdate = async (req, res) => {
    const products =  await prisma.product.findMany({
        where:{
            belongsToId: req.user.id
        },
        include: {
            update: true
        }

    })

    
    const updates = products.reduce((allUpdates, product) => {
        return [...allUpdates, ...product.update]
    }, [])

    const match = updates.find(update => update.id === req.params.id)

    if(!match){
        return res.json({message: 'nope'})
    }
    const updatedUpdate = await prisma.update.update({
        where:{
            id: req.params.id
        },
        data: req.body
    })

    res.json({data: updatedUpdate})
}

export const deleteUpdate = async (req, res) => {

    const products =  await prisma.product.findMany({
        where:{
            belongsToId: req.user.id
        },
        include: {
            update: true
        }

    })

    
    const updates = products.reduce((allUpdates, product) => {
        return [...allUpdates, ...product.update]
    }, [])

    const match = updates.find(update => update.id === req.params.id)


    const deleted =  await prisma.update.delete({
        where:{
            id: req.params.id
        }
    })



    res.json({data: deleted})
}