
    var idSessionStorage = sessionStorage.getItem('currentSessionDaon');
    var environmentToken = sessionStorage.getItem('environment');
    console.log("js_token_" +environmentToken);
    if (idSessionStorage && environmentToken) {
        var data = JSON.parse(idSessionStorage);
        if (data) {
            var sessionIDS = data._id
            console.log(sessionIDS);

            $(window).bind("load", function() {
                const url = 'https://static.securedtouch.com/sdk/st-ping-1.1.0p.js?appId=mit&id='+environmentToken+'&sessionId='+sessionIDS+'';
                console.log("URL_SCRIP: "+url)
                $.getScript( url, function() {
                console.log("external js executed");
                });
            });

            $(window).bind("load", function() {
                const url = 'https://static.securedtouch.com/sdk/securedtouch-sdk-3.5.3w.js';
                $.getScript( url, function() {
                console.log("external js executed");
                
                });
            });

            

            
            //document.write('<script id="cc091bb3a3e3bef61d49e360dcfdbc84" src="https://static.securedtouch.com/sdk/st-ping-1.1.0p.js"></script>');
        }
    }

    

