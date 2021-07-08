exports.getPosts = (req, res, next) => {
    res.status(200).json({
        posts: [
            {
                _id: '1',
                title: 'First Post',
                content: 'First post content',
                imageUrl: 'images/book1.jpg',
                creator: {
                    name: 'Fuad'
                },
                createdAt: new Date()
            }
        ]
    });
}

exports.createPost = (req, res, next) => {
    const content = req.body.content;
    const title = req.body.title;
    res.status(201).json({
        message: 'Post created succussfully!',
        post: {id: new Date().toISOString(), title: title, content: content}
    })
}