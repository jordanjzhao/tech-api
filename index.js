const PORT = 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()

const newspapers = [
    {
        name: 'businessinsider',
        address: 'https://www.businessinsider.com/sai',
        base: 'https://www.businessinsider.com'
    },
    {
        name: 'geekwire',
        address: 'https://www.geekwire.com/',
        base: ''
    },
    {
        name: 'cnbc',
        address: 'https://www.cnbc.com/technology/',
        base: ''
    },
    {
        name: 'wsj',
        address: 'https://www.wsj.com/news/technology',
        base: ''
    },
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/international/section/technology',
        base: 'https://www.nytimes.com/'
    },
    {
        name: 'usatoday',
        address: 'https://www.usatoday.com/tech/',
        base: 'https://www.usatoday.com'
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            
            $('a:contains("tech")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })
        })
})

app.get('/', (req, res) => {
    res.json('Welcome to Tech News API')
})

app.get('/news', (req, res) => {
    // axios.get('https://finance.yahoo.com/tech')
    // .then((response) => {
    //     const html = response.data
    //     const $ = cheerio.load(html)

    //     $('a:contains("tech")', html).each(function () {
    //         const title = $(this).text()
    //         const url = $(this).attr('href')
    //         //const img = $(this).attr('src')
    //         articles.push({
    //             title,
    //             url
    //         })
    //     })
    //     res.json(articles)
    // }).catch((err) => console.log(err))
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId
    
    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base

    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("tech")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))