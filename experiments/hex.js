
app.post('/spi', (req, res) => {
    input = req.body
    console.log(req.body)
    // "25 00 01 000192CD0000002F6D6E 742F7"
    input = input.replace(/ /g, '')
    var buf = Buffer.from(input , "hex")
    console.log(buf)
    var pid = 999; // TODO
    response = {
        received: input,
        parsed: buf,
        pid: pid
    }
    res.json(response)
})

