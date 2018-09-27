module.exports = {
    toHump: str => str.replace(/-(\w)/g, 
        x => x.slice(1).toUpperCase()),
    toLine: str => str.replace(/([A-Z])/g,"-$1").toLowerCase()  
}