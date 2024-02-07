/*
Hogyan tudunk felvinni adatokat, mondjuk formból 
*/

function CreateProduct() {
    const [categories, setCategories] = useState([]);
    const [pData, setPData] = useState({
        category: "",
        brand: "",
        title: "",
        stock: ""
    });
    const [pErrors, setPErrors] = useState({
        category: "",
        brand: "",
        title: "",
        stock: ""
    });

    const getCategories = async () => {
        const response = await fetch("https://dummyjson.com/products/categories");
        const json = await response.json();//fontos, hogy json-ben kapjuk meg ezeket az adatokat 

        //console.log(json);
        /*
        !!! és csak akkor kapjuk vissza a kategóriákat, amit itt kikonzolozunk a json-vel, ha 
        utána egy useEffect-ben!!!!!!!!!!! meghívjuk a függvényt 

        és akkor, így viszontkátjuk a kategóriákat ["smartphones","laptops","fragrances","skincare","groceries"...stb.]
        0: "smartphones"
        1: "laptops"
        2: "fragrances"
        3: "skincare"
        4: "groceries"
        ...stb. 
        length: 20
        [[Prototype]]: Array(0)

        És majd ezeket fogjuk megjeleníteni, hogy elöször a függvényen kivül csinálunk egy useState-s változót a categories-nak
        const [categories, setCategories] = useState([]);
        és azután setteljük ebbe a json-t ->
        */
        setCategories(json);
        /*
        Miután ezt setteltük átmegyünk a select mezőnk option-jába, ahol egy mappal végigmegyünk a categories-okon és megjelenítjük őket
        option-ökként
            <select className="w-80">
                <option value={0}>Válassz Kategóriát!</option>
                {
                     categories.map((c, i)=> 
                        <option key={i}>{c}</option>
                    )
                }
            </select>
        így megjelent az összes kategóriánk
        */
    };

    const create = async (e) => {
        e.preventDefault();
        const errors = {};

        if (pData.category.length === 0)
            errors["category"] = "Nem választottad ki a kategóriát!";

        if (pData.brand.length === 0)
        errors["brand"] = "Nem adtad meg a márkát!";

        setPErrors(errors);//ezzel megadjuk a lokális errors objektum értékét a globális pErrors-nak

        if (Object.keys(errors).length !== 0)
        return;

        /*
        Hogyan küldjük be a termékadatokat -> 
        létrehozunk egy pData(product data-ra utal) nevű useState-s változót
        const [pData, setPData] = useState([]);
        
        és ez a sima onChange-s dolog -> 
            <h3>Kategória</h3>
            <select onChange={(e)=> setPData()}
        Hogyha megváltozik a kategoriánknak az értéke, akkor azt mondjuk, hogy setPData()
        de ezzel, így van egy kis probléma, mert ha azt mondjuk neki a setPData(e.target.value)
        akkor a productData egyetlen egy termék lesz, méghozzá az, hogy mi a kategória, tehát ez egy string lesz és ez így nem jó, de ->
        p -> ez a korábbi érték a producData-nak és kinyítjuk a kulcsait a spread operatorral {...p} és utána, mondjuk azt, hogy a category
        az e.target.value lesz 
        <select onChange={(e)=>setPData(p=>({...p, category:e.target.value}))}
        és még arra ügyelni, kell, hogy a productData(pData) az nem egy sima tömb, hanem egy objektum, ilyen formában -> 
        const [pData, setPData] = useState({
            category:"", kapnak kezdőértékként egy üres string-et
            brand:"",
            title:"",
            stock:""
        })

        és !!!!!!!!!!!!! ugyanugy minden input mezőnek megadjuk, amit megcsináltunk a select mezőnek ezt -> 
        onChange={(e)=>setPData(p=>({...p, category:e.target.value}))}

        pl. a márkánál ez lesz -> <input onChange={(e)=>setPData(p=>({...p, brand:e.target.value}))} !!!!brand
        ez meg a megnevezésnél -> onChange={(e)=>setPData(p=>({...p, title:e.target.value}))} !!!!!!title

        még arra kell figyelni, hogy a stock-nál, mivel az egy szám, ezért kell parseInt-elni is

        !!!!!ha készen vagyunk a felettivel, akkor a button-ünknek megadjuk ezt a create onClick-ként -> 
        <button onClick={create}>Mentés</button>
        */
        console.log(pData);
        /*
        És akkor kiválasztjuk a böngészőben a kategóriát, megadunk, beírunk valamit a márkához, megnevezéshez és a készlethez
        rákkatintunk a mentés gombra és itt vesszük észre, hogy újratölti az oldalt és eltünnek azok a dolgok, amiket beírtunk
        -> 
        erre az kell, hogy az eseményobjektum preventDefault-ját meghívjuk 
        const create = async (e)=> {
        e.preventDefault();

        és így most preventDefault-val beírtunk mindenhova valamit illetve kiválasztottuk a kategóriát 
        akkor vissza fogunk kapni egy objektumot, azokkal az értékekkel -> 
        {category: 'smartphones', brand: 'asdfasdf', title: 'asdfasdf', stock: 65456}
        brand: "asdfasdf"
        category: "smartphones"
        stock: 65456
        title: "asdfasdf"
        [[Prototype]]: Object
        */
        //és akkor most jön a await fetch-es rész
        const response = await fetch("https://dummyjson.com/products/add", {
            method: "POST",
            header: { "content-type": "application/json" },
            body: JSON.stringify(pData)
            /*
            Azért kell stringify-olni, mert JSON stringet küldünk el!!!!!!!!!!!
            */
        });

        //egy json választ is kapunk 
        const json = await response.json();
        //megnézzük, hogy mit válaszol nekünk 
        console.log(json);
        /*
        Kitöltünk mindent a böngészőben és beküldjük
        Így visszaad nekünk egy id-t, ami teljesen üres -> {id:101}
        id: 101
        [[Prototype]]: Object
        !!!!! de ha viszont nem írunk be semmit és rákattintunk a gombra, akkor is ezt fogjuk visszakapni

        Megnézzük, hogy vannak-e hibák a kódban
        Ehhez létrehozunk egy pErrors useState-s változót felül, ilyen formában és mindegyik mezőhöz külön-külön error-okat tudunk beállítani
        és úgy tudjuk őket eléírni, hogy pErrors.title, pErrors.stock stb.

        const [pErrors, setPErrors] = useState({
            category:"", 
            brand:"",
            title:"",
            stock:""
        });

        ezután a kategóriához, márkához stb. csinálünk egy label mezőt 
            <h3>Kategória</h3>
            <label className="error-label"></label>
        megformázzuk az error-label-t css-ben
        és akkor a pErrors-ból lesz ebbe a category {pErrors.category}->
        <label className="error-label">{pErrors.category}</label>
        mert ez a category-hoz tartozó hibaüzenetek és ugyanugy ilyen formában megcsináljuk az összeshez, annyi különbséggel, hogy a 
        végén nem pErrors.category hanem .brand, .stock stb lesz
        Alapból nem jelenik meg semmi sem, csak kicsit távolabb lett, ugye a h3-as mező az input/selecttől, 
        mert oda csináltunk ezeket a label-eket
        de ezt úgy is meg lehet csinálni, hogy csak akkor jelenjen meg, hogyha a pErrors.category.length
        egyenlő nullévak, akkor egy üres string, ha meg nem akkor meg <label className="error-label">{pErrors.category}</label>
        és így meg lehet oldani a többit, mint ezt a category-t
                        {
                            pErrors.category.length === 0 ? "" : <label className="error-label">{pErrors.category}</label>
                        }
        ennek a függvénynek a legtetején létrehozunk egy erros objektumot!!!!!!!!!!!!!!!!
        const errors = {};
        és amennyiben a pData.category.length az nem egyenlő nullával akkor az errors["category"] az egyenlő lesz egy hibaüzenettel -> 
        if(pData.category.length === 0)
            errors["category"] = "Nem választottad ki a kategóriát!"

        if (Object.keys(errors).length !== 0)
            setPErrors(errors);
        return;
        és még ezt írtuk, hogyha az errors objetumunknak a kulcsa nem egyenlő nullával, tehát van hibaüzenetünk, 
        akkor egyfelöl returnölünk, másfelöl kiíratjuk a hibaüzenetet, ami van az errors kulcsakaként megadva
        */
        /*************************************************************************************************************************
        változtatások -> 
        a felső pErrors az csak legyen egy üres objektum {}
        ehelyett 
        const [pErrors, setPErrors] = useState({
            category: "",
            brand: "",
            title: "",
            stock: ""
        });
        és nem azt mondjuk itt, hogy a length-je 
        pErrors.category.length === 0 ? "" : <label className="error-label">{pErrors.category}</label>
        hanem -> 
        pErrors.category === undefined ? "" : <label className="error-label">{pErrors.category}</label>
        ugyanis akkor ez a category nem lesz meg alapból hanem csak akkor fog elkészülni a category 
        hogyha ebben a függvényben létrehozzuk a lokális változónkban 
        const errors = {}
        és utána a setPErrors(errors-val) a lokális változónk értékeit beállítjuk a globális változónk értékeire 
        globális változó -> const [pErros, setPErrors]

        !!!!!!!!!az nem fog müködni, hogy 
        if(pData.category.length ===0) {
            errors.category = "Nem választottad ki a a kategóriát"
            setPErrors(p=>({...p, category:"Nem választottad ki a kategóriát"}))
        }
        mert ilyenkor az történik, hogy amint beállítjuk a pErrorsnak az értékét a setPErrors-val, abban a pillanatban megindul egy 
        új életciklus és hogyha van mégegy ilyenünk -> 
        if(pData.brand.length ===0) {
            errors.brand = "Nem választottad ki a a kategóriát"
            setPErrors(p=>({...p, brand:"Nem adtad meg a márkát"}))
        }
        !!!akkor ezzel is megindul egy új életciklus és csak az utolsó lesz benne
        Tehát ez olyan, mintha ezzel -> setPErrors(p=>({...p, category:"Nem választottad ki a kategóriát"})) megindulna egy új életciklus 
        és akkor az új életciklusban ezt -> setPErrors(p=>({...p, brand:"Nem adtad meg a márkát"})) -> itt még nem látjuk a változást, ami 
        végbement a setPErrors(p=>({...p, category:"Nem választottad ki a kategóriát"})), hanem ezt csak úgy láthatnánk, ha csinálnánk egy 
        useEffect-et a PErrors-ra, de akkor meg annyiszor futna le a useEffect ahányszor lefutatnánk ezt a setPErrors-t és emiatt készítünk itt 
        egy külön lokális változót és majd a végén megadjuk a globálisnak 
        ->
        const errors = {};

        if (pData.category.length === 0)
            errors["category"] = "Nem választottad ki a kategóriát!";

        if (pData.brand.length === 0)
        errors["brand"] = "Nem adtad meg a márkát!";

        setPErrors(errors);

        és így viszont a lokális változó const errors = {}; értékét végül megadjuk a setPErrors(errors);

        és ha az errors-nak a length-je 
        if (Object.keys(errors).length !== 0)
        return;

        Az Object.keys az azt csinálja, hogy egy tömbbe kiszedi a objektum kulcsait és ha itt nem üres objektumról van szó 
        akkor return-ölünk, azért, ami utána van az már ne fusson le (const response-os dolog)

        és ezeket megcsináljuk mindegyikre -> 
        {
            pErrors.stock === undefined ? "" : <label className="error-label">{pErrors.stock}</label>
        }

        akkor, így most kiírja, hogy nem adtuk meg a márkát meg a kategóriát, de ha megadjuk, akkor meg eltünik

        következőleg folytatás
        */

    };

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <div className="container text-center">
            <form>
                <div className="product-page-grid">
                    <div className="product-data-box">
                        <h3>Kategória</h3>
                        {
                            pErrors.category === undefined ? "" : <label className="error-label">{pErrors.category}</label>
                        }
                        <select onChange={(e) => setPData(p => ({ ...p, category: e.target.value }))}
                            className="w-80">
                            <option value={0}>Válassz Kategóriát!</option>
                            {
                                categories.map((c, i) =>
                                    <option key={i}>{c}</option>
                                )
                            }
                        </select>

                        <h3>Márka</h3>
                        {
                            pErrors.brand === undefined ? "" : <label className="error-label">{pErrors.brand}</label>
                        }
                        <input onChange={(e) => setPData(p => ({ ...p, brand: e.target.value }))}
                            className="w-80"
                            type="text" />
                    </div>
                    <div className="product-data-box">
                        <h3>Megnevezés</h3>
                        {
                            pErrors.title === undefined ? "" : <label className="error-label">{pErrors.title}</label>
                        }
                        <input onChange={(e) => setPData(p => ({ ...p, title: e.target.value }))}
                            className="w-80"
                            type="text" />

                        <h3>Készlet</h3>
                        {
                            pErrors.stock === undefined ? "" : <label className="error-label">{pErrors.stock}</label>
                        }
                        <input onChange={(e) => setPData(p => ({ ...p, stock: parseInt(e.target.value) }))}
                            className="w-80"
                            type="text" />
                    </div>
                </div>

                <button onClick={create}>Mentés</button>
            </form>
        </div>
    );
}

/*
Mivel sok adat van ezért egy kétosztható grid-ben fogjuk megoldani -> product-page-grid,
ezekbe csináltunk két darab className="product-data-box"-ot és ez egészet beletettük egy form-ba

Az első product-data-box-ban a kategoriák lesznek, ez egy select mező, mert a kategoriákat külön le lehet majd szedni 
select mező is megkapja a css-ben, mint a button és az input a display: block-ot és a margin: 15px auto;-ot

A select mezőbe jönnek az option-ök, az első option mezőnek a value-ja 0 lesz és Válassz Kategóriát! lesz majd kiírva
    <h3>Kategória</h3>
    <select>
        <option value={0}>Válassz Kategóriát!</option>
    </select>

Következő lesz a márkák és mivel nem tudjuk leszedni az összes márkát, ami létezik, szóval ennek a keresésére létrehozunk egy 
input mezőt type="text"-vel ->
    <h3>Márka</h3>
    <input type="text"/>

ezek vannak az első className="product-data-box"-ban

A másik className="product-data-box"-ban ugyanilyen formában megcsináljuk a Megnevezést és a Készletet is input mezővel

!!!!!!!!!!!!!Megnézzük, hogy hogyan müködik ez a CreateProduct komponens és ilyenkor az App.js-ben ezt kell beírni ->
function App() {
    return (
        <CreateProduct/>
    );
}

És akkor felül meg kell jelennie ennek is, hogy importáltuk ->
import CreateProduct from './components/CreateProduct';
de a másik is megmarad ->
import Products from './components/Products';

Megjelenítettük és formázzuk css-ben
csinálunk egy .text-center osztályt és ezt megkapja az egész container, mert minden lehet text-align: center;
-> 
    <div className="container text-center">

Megformázzuk a prudct-data-box-ot is 

A product-page-grid-en kivül, de a form-on belül, csinálunk egy button-t
<button>Mentés</button>
és akkor ez középen lesz a két box-unk alatt 

!!!!!!!!!!!!Mivel ez egy form-on belül van. ezért újratölti az oldalt, ha rákattintunk a button-ra
ezt majd lekezeljük 

Csináltunk css-ben egy .w-80 osztályt -> width: 80%;
és azt megadjuk pl. a select mezőnknek, hogy ez szélesebb legyen, jobban kimenjen a benné lévő box széléig
<select className="w-80">
és a többi input mező is megkapja ezt a class-t
    <input className="w-80"
    type="text"/>
így ugyanolyan széles lesz az input és a select mezőnk is 
*************************************************************************************************************
Következő, hogy le kell szednünk a kategóriákat a dummyjson.com-ról és megjeleníteni őket a option-ökként
->
ezt kell majd nekünk fetch-elni -> (https://dummyjson.com/products/categories)
és, ha ezt így beírjuk a böngészőben, akkor ott lesz az összes kategória, egy sima tömbben ->
["smartphones","laptops","fragrances","skincare","groceries","home-decoration","furniture","tops",
"womens-dresses","womens-shoes","mens-shirts","mens-shoes","mens-watches","womens-watches","womens-bags",
"womens-jewellery","sunglasses","automotive","motorcycle","lighting"]

Csinálunk egy getCategories függvényt 
!!!!!!!, aminek arrow functionnek kell lennie és még async-nek is 
ennek fent van a leírása és lejöttek a kategóriáink, amiből tudunk majd vélasztani 

Még ott van nekünk a Megnevezés, Készlet, Márka 
!!!!!!!!!Most megnézzük, hogy melyik endpoint-ot kell megszólítanunk, ahhoz, hogy létre tudjunk hozni termékeket 
ez valahogy majd, így kell, hogy kinézzen -> 

fetch('https://dummyjson.com/products/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
  title: 'BMW Pencil',

meg kell mondani, hogy ez egy post metódus, beállítani a header-t, hogy json adatokat tudjunk majd küldeni és majd a body-t megadni neki
!!!!!! ezt majd úgy fogjuk megtenni, hogy a Mentés gombra kattintunk és ehhez rendelünk egy onClick-es eseménykezelőt és majd ott csináljuk meg
csinálunk a getCategories függvény alá egy createProducts-ot

https://dummyjson.com/docs/products, itt lehet megnézni, hogyan lehet add-olni, update-lni stb.

*/

export default CreateProduct;
