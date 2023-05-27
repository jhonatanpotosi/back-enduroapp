const utilText = {} 

utilText.capitalizeFirstLetter = async(text) => {
    return text.charAt(0).toUpperCase(text) + text.slice(0).toLowerCase()
};

utilText.capitalize = async(text) => {
    return text.replace(/\w\S*/g, 
        function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        })
};

module.exports = { utilText }