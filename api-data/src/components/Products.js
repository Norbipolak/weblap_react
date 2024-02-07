/*
Hogyan tudunk API-ból lehívni adatokat React segítségével 
dummyjson.com-ról fogjuk lehívni a termékeket és megjelenítjük őket 
Csinálunk olyat, hogy egyes termékeknek az adatait szedjük updatelünk és felviszünk termékeket 
*/

function Products() {
    /*
    Termékadatokat meg kellene kapnunk és létrehozunk egy komponensváltozót, ami egy üres tömb lesz 
    */
    const [products, getProducts] = useState([]);

    const getProducts = async ()=> {
        //async metódus, leszedünk termékeket a fetch API segítségével 
        const response = await fetch("http://dummyjson.com/products");
        //átadjuk paraméterként a fetch metódusnak hogy honnan szeretnénk leszedni a termékeket, melyik oldalról
        console.log(response);
        /*
        Visszakapunk egy response objektumot -> 
        body: (...) -> body az üzenettest, de ezt nem így fogjuk tudni kiolvasni, 
        hanem const json = await response.(és itt van sokféle blod, body, headers, json)
        de mivel nekünk json API-unk van ezért const json = await response.json();
        bodyUsed: false
        headers: Headers {}
        ok: true -> azt jelenti, hogy minden rendben ment 
        redirected: false
        status: 200 -> a válaszüzenetben (https válaszban) a status (amelyik 4-es kezdődik az a kliens hiba, kliens rontott el valamit) 
        5-ös a szerverhiba, 1-es az informativ, 2-es, hogy minden rendben van, 3-as átirányítás
        statusText: ""
        type: "cors"
        url: "https://dummyjson.com/products"
        [[Prototype]]: Response
        */

        const json = await response.json();
        /*
        Itt megérkeznek az adataink, megkaptuk azt, hogy mi van a response objektumunk body-jában?
        {products: Array(30), total: 100, skip:0, limit:30}
        limit: 30
        products: (30) {...}, {...} -> itt vannak a termékeink 30-sával 
        így néz ki egy product {...} kinyitva 
        0: {id: 1, title: 'Iphone 9', description: '..'} és itt még van egy pár dolog a termékről pl. price stb..
        skip: 0
        total: 100
        [[Prototype]]: Object
        */

        //megadjuk a setProducts-nak a json.products-ot, ahol a termékeink vannak, lásd feljebb 
        setProducts(json.products);

    }

    //getProducts();
    /*
    Itt ezzel lesz egy kis probléma, mert ha a komponensünkben meghívjuk ezt a getProducts-ot 
    ilyenkor számtalanszor el kezdi meghívogatni ezt (a response-ot és a response.json-t)
    az API endpoint-ot és lehívni az adatokat 

    ez azért van ->
    mert a komponens mindig frissiti önmagát, hogyha a komponensváltozó értéke módosul,
    tehát ha a (const [products, getProducts] = useState([]);) products-nak az értéke módosul, akkor frissül a komponens
    így újra betölti azt, így újra meghívja a getProducts-ot, viszont a getProducts megintcsak leszedi a termékeket, 
    így megint frissükt a komponensnek az értéke és megint csak meghívja a getProducts-ot és ez egy ilyen végtelen kör 

    ezért kell, használni a useEffect-et, mert ha a useEffect második paramétereként átadunk egy üres tömböt, akkor csak akkor fogja lefutatni
    ezt a useEffect-et, mikor a komponenst betölti és ha useEffect-ben (callback function-jében) szedjük le a getProducts-ot, akkor csak kétszer
    fogjuk megkapni, mert valamiért kétszer tölti be a komponenst
    */
    useEffect(()=> {
        getProducts();
    }, []);

    /*
    Így megkaptuk a product-okat, most meg fogjuk jeleníteni őket a return-ben csináltunk egy container-t és még egy product-grid-et
        <div className="container">
            <div className="product-grid">
                
            </div>
        </div>  
        és akkor ebbe a products-grid-ben a map segítségével belerakosgatjuk a product-okat 

        így néz ki a végleges -> 
                    products.map((p, i)=> 
                        <div classname="product" key={i}>
                            <h4>{p.title}</h4>
                            <div className="product-img">
                                <img src={p.thumbnail}/>
                            </div>
                            <div className="product-data">
                                <div>
                                    <b>Ár:</b> <br/>
                                    {p.price}$
                                </div>
                                <div>
                                    <b>Kategória:</b> <br/>
                                    {p.category}
                                </div>
                                <div>
                                    <b>Márka:</b> <br/>
                                    {p.brand}
                                </div>
                                <div>
                                    <b>Készlet:</b> <br/>
                                    {p.stock} db.
                                </div>
                            </div>
                        </div>
                    )
                }

    leírás: 
    a map-val végigmentünk a products-okon, ugye a mapnak van két paramétere a p-mint a products és az i, mint index 
    és csináltunk egy div-et ami kapott egy product className-t, ebben vannak megjelenítve az egyes termékek  
    ebben van 3 dolog 
    1. legfelül a p.title -> a termék elnevezése 
    2. egy product-img div, amiben beleraktuk a <img src={p.thumbnail}/> tehát a terméknek a képét 
    3. egy product-data div ami egy grid 1fr 1fr 
    és ebben a következő formában beleraktuk az árat, kategoriát, márkát, készletet
        <div className="white-box">
            <b>Ár:</b> <br/>
            {p.price}$
        </div>
    
    elemek formázása fontos css-ben!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    */

    return(
        <div className="container">
            <div className="products-grid">
                {
                    products.map((p, i)=> 
                        <div classname="product" key={i}>
                            <h4>{p.title}</h4>
                            <div className="product-img">
                                <img src={p.thumbnail}/>
                            </div>
                            <div className="product-data">
                                <div className="white-box">
                                    <b>Ár:</b> <br/>
                                    {p.price}$
                                </div>
                                <div className="white-box">
                                    <b>Kategória:</b> <br/>
                                    {p.category}
                                </div>
                                <div className="white-box">
                                    <b>Márka:</b> <br/>
                                    {p.brand}
                                </div>
                                <div className="white-box">
                                    <b>Készlet:</b> <br/>
                                    {p.stock} db.
                                </div>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>  
    );
}

export default Products;