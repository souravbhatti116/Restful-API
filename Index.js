const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();


app.set('view engine', 'ejs');
app.use(express.static('public'));
mongoose.connect("mongodb://localhost:27017/wikiDB"); 

const articleSchema = {
    title: String,
    content: String,
}

const Article = mongoose.model('Article', articleSchema);

app.use(bodyParser.urlencoded({extended: true}));

///////////////// Request Targeting all Articles /////////////////////
app.route('/articles')                                          // Method Chaining..

    .get((req, res) => {
        Article.find()
        .then((articles) => {
            res.send(articles);
        }).catch((err) =>{
            res.send(err);
        })
    })

    .post((req, res) => {
        const article = new Article({
            title: req.body.title,
            content: req.body.content,
        })
        article.save()
        .then((res) => {
            console.log(res);
        }).catch((err) =>{
            console.log(err);
        })
        res.redirect('/articles')
    })

    .delete((req, res) => {
        Article.deleteMany()
        .then((response) => {
            res.send("Successfully Deleted all Articles");
        })
    });

/////////////////////////////Specific Articles Routes //////////////////////////////////////////

app.route('/articles/:articleTitle')
    .get((req, res) =>{
        Article.findOne({title : req.params.articleTitle})
        .then((foundArticle) => {
            if (foundArticle) {
                res.send(foundArticle);
            }else{
                res.send("No Article by name " + req.params.articleTitle)
            }
        })
    })

    .put((req, res) =>{
        Article.updateOne
        ({title: req.params.articleTitle},
         {title: req.body.title, content: req.body.content},
        )
         .then((response) => {
            res.send('Successfully Updated.')
         })
    })

    .patch((req, res) =>{
        // console.log(req.body);
        Article.updateOne
        ({title: req.params.articleTitle},
         //{title: req.body.title, content: req.body.content},
         {$set: req.body}
        )
         .then((response) => {
            res.send('Successfully Updated.')
         })

    })

    .delete((req, res) =>{
        Article.deleteOne({ title: req.params.articleTitle})
        .then((response) => {
            res.send('Article deleted Successfully' + req.params.articleTitle)
        })

    });


app.listen(3000, () => console.log("Server Running. "))