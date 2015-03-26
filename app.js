var ldap = require('ldapjs');

ldap.Attribute.settings.guid_format = ldap.GUID_FORMAT_B;

var client = ldap.createClient({
    url: 'ldap://127.0.0.1/dc=xish,dc=com',
    maxConnections: 4,
    bindDN: 'cn=Manager,dc=xish,dc=com',
    bindCredentials: '123456'
})

var opts = {
    filter: '(objectclass=*)',
    scope: 'one',
    attributes: null
};

get();

function entryParser(entry) {
    var obj = {};
    obj.dn = entry.dn;
    obj.results = {};

    entry.attributes.forEach(function(o, i) {
        obj.results[o.type] = o.vals
    })

    return obj;
}

function add() {
    client.add('cn=ta,ou=RD,dc=xish,dc=com', {
        cn: 'ta',
        sn: 'ta',
        cn: "圣堂",
        objectclass: 'inetorgperson'
    }, function(err) {
        if (err) return console.log('err:' + JSON.stringify(err))
        console.log('ok');
    })
}

function modify() {
    var change = new ldap.Change({
        operation: 'replace',
        modification: {
            cn: ['圣堂刺客', 'ta']
        }
    });

    client.modify('cn=ta,ou=RD,dc=xish,dc=com', change, function(err) {
        if (err) return console.log('err:' + JSON.stringify(err))
        console.log('ok');
    });
}

function get() {
    client.search('ou=RD,dc=xish,dc=com', opts, function(err, search) {
        search.on('searchEntry', function(entry) {
            console.log(entryParser(entry))
        });
    });
}

function del() {
    client.del('cn=ta,ou=RD,dc=xish,dc=com', function(err) {
        if (err) return console.log('err:' + JSON.stringify(err))
        console.log('ok');
    })
}
