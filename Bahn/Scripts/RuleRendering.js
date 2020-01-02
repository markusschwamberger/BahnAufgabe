(function () {
    var customRenderingOverride = {};
    customRenderingOverride.Templates = {};
    customRenderingOverride.Templates.Fields = {
        "Status": { "View": renderStatus }
    }

    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(customRenderingOverride);
})();

function renderStatus(ctx) {
    var statusName = ctx.CurrentItem[ctx.CurrentFieldSchema.Name];
    var color = readFile(statusName);
    return "<span style='color:" + color + "'>" + statusName + "</span>";
}

function readFile(statusName) {
    var clientContext;
    var oWebsite;
    var fileUrl;

    clientContext = new SP.ClientContext.get_current();
    oWebsite = clientContext.get_web();

    clientContext.load(oWebsite);
    clientContext.executeQueryAsync(function () {
        fileUrl = oWebsite.get_serverRelativeUrl() +
            "/Lists/ProjectRule/Rules.xml";
        $.ajax({
            url: fileUrl,
            type: "GET"
        })
            .done(Function.createDelegate(this, successHandler))
            .error(Function.createDelegate(this, errorHandler));
    }, errorHandler);

    function successHandler(data) {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(data, "text/xml");

        return xmlDoc.getElementsByTagName("Rules")[0].childNodes[0].nodeValue;
    }

    function errorHandler() {
        return "yellow";
    }
}