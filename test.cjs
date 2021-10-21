const privateHomesObj = require('./privateHomesArr.json')
const fs = require('fs');

const images = [{
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839835/mainSite/privateHomes/thumbs/93._Main_8720_Rosewood_arwel3.webp',
        label: 'Rosewood',
        images: [],
        address: '8720 Rosewood'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839837/mainSite/privateHomes/thumbs/9._Main_320_N_La_Jolla_Ave_rdx1i5.webp',
        label: 'La Jolla Ave',
        images: [],
        address: '320 N La Jolla Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/87._Main_16366_Sloan_qfyoqc.webp',
        label: 'Sloan',
        images: [],
        address: '16366 Sloan'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/80._Main_428_N_La_Jolla_hvrhsu.jpg',
        label: 'NLaJolla',
        images: [],
        address: '428 N La Jolla'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839836/mainSite/privateHomes/thumbs/8._Main_3142_Danny_Hill_Dr_jdpjsd.webp',
        label: 'Danny Hill Dr',
        images: [],
        address: '3142 Dannyhill Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/79._Main_1845_Coldwater_pj1wbf.jpg',
        label: 'Coldwater',
        images: [],
        address: '1845 Coldwater'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/78._Main_8971_W_Shoreham_ghbdgu.jpg',
        label: 'Shoreham',
        images: [],
        address: '8971 W. Shoreham'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/77._Main_1349_N_Gardner_al3joa.jpg',
        label: 'Gardner',
        images: [],
        address: '1349 N Gardner'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/76._Main_152_S_Laurel_bkchip.jpg',
        label: 'Laurel',
        images: [],
        address: '152 S Laurel'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/75._Main_527_N_Harper_dmrio3.jpg',
        label: 'Harper',
        images: [],
        address: '527 N Harper'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/74._Main_527_N_Harper_xsxkms.jpg',
        label: 'Harper',
        images: [],
        address: '527 N Harper'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/73._Main_312_La_Peer_io0jrx.jpg',
        label: 'La Peer',
        images: [],
        address: '312 S La Peer'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/72._Main_8381_Hollywood_Blvd_htjdu1.jpg',
        label: 'Hollywood Blvd',
        images: [],
        address: '8381 Hollywood Blvd'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/71._Main_824_N_La_Jolla_Ave_svuf0i.jpg',
        label: 'La Jolla Ave',
        images: [],
        address: '824 N La Jolla Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/70._Main_349_S._Mansfield_Ave._dscjv9.webp',
        label: 'S Mansfield Ave',
        images: [],
        address: '349 S. Mansfield Ave.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839835/mainSite/privateHomes/thumbs/7._Main_424_La_Jolla_Ave_cskfeg.webp',
        label: 'La Jolla Ave',
        images: [],
        address: '424 La Jolla Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/69._Main_12117_Greenock_Ave_dn1sll.jpg',
        label: 'Greenock Ave',
        images: [],
        address: '12117 Greenock Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/68._Main_1484_Edris_Dr_znkrey.jpg',
        label: 'Edris Dr',
        images: [],
        address: '1484 Edris Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/67._Main_815_Tigertail_xkqzgg.webp',
        label: 'Tigertail',
        images: [],
        address: '815 Tigertail'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/66._Main_4439_Stansbury_ytsw0k.jpg',
        label: 'Stansbury',
        images: [],
        address: '4439 Stansbury'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/65._Main_405_N_Kilkea_kfnhhl.webp',
        label: 'Kilkea',
        images: [],
        address: '405 N Kilkea'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/64._Main_524_Ocampo_bfzjim.jpg',
        label: 'Ocampo',
        images: [],
        address: '524 Ocampo'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/63._Main_255_Bernard_Ave_ws0arq.jpg',
        label: 'Bernard Ave',
        images: [],
        address: '255 Bernard Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/62._Main_13020_Greenleaf_jobqgc.webp',
        label: 'Greenleaf',
        images: [],
        address: '13020 Greenleaf'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/61._Main_9401_Sawyer_St_dbl6sf.webp',
        label: 'Sawyer St',
        images: [],
        address: '9401 Sawyer St'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/60._Main_641_Mildred_Ave_kalguc.webp',
        label: 'Mildred Ave',
        images: [],
        address: '641 Mildred Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839836/mainSite/privateHomes/thumbs/6._Main_535_West_Knoll_Dr._i0fyln.webp',
        label: 'West Knoll Dr',
        images: [],
        address: '535 West Knoll Dr.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/59._Main_2351_Mt_Olympus_k9zmm0.jpg',
        label: 'Mt Olympus',
        images: [],
        address: '2351 Mt Olympus'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/58._Main_3114_Elvido_Dr_wbb6qf.webp',
        label: 'Elvido Dr',
        images: [],
        address: '3114 Elvido Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/57._Main_23590_Park_South_St_scxulm.jpg',
        label: 'Park South St',
        images: [],
        address: '23590 Park South St'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/56._Main_1847_Coldwater_Cyn_jxbpj7.jpg',
        label: 'Coldwater Cyn',
        images: [],
        address: '1847 Coldwater Cyn'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/55._Main_631_Mansfield_Ave_cmksmh.jpg',
        label: 'Mansfield Ave',
        images: [],
        address: '631 S Mansfield Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/54._Main_543_N_Kilkea_ggken4.webp',
        label: 'Kilkea',
        images: [],
        address: '543 N Kilkea'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/53._Main_9814_Hythe_Ct_lcrqtr.webp',
        label: 'Hythe Ct',
        images: [],
        address: '9814 Hythe Ct'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/52._Main_813_N_Laurel_Ave_hjpyz2.jpg',
        label: 'Laurel Ave',
        images: [],
        address: '813 N Laurel Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839829/mainSite/privateHomes/thumbs/51._Main_733_N_Las_Palmas_Ave_zkjuqi.webp',
        label: 'Las Palmas Ave',
        images: [],
        address: '733 N Las Palmas Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839835/mainSite/privateHomes/thumbs/5._Main_639_Mildred_Ave_q1y8gt.webp',
        label: 'Mildred Ave',
        images: [],
        address: '639 Mildred Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/49._Main_727_N_Las_Palmas_Ave_v2eosj.jpg',
        label: 'Las Palmas Ave',
        images: [],
        address: '727 N Las Palmas Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/48._Main_147_N_Stanley_Dr_fc0amt.jpg',
        label: 'Stanley Dr',
        images: [],
        address: '147 N Stanley Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/47._Main_2240_Stanley_Hills_Dr_uhwgv7.jpg',
        label: 'Stanley Hills Dr',
        images: [],
        address: '2240 Stanley Hills Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/46._Main_164_N_Hamel_Dr_y2qe0h.jpg',
        label: 'Hamel Dr',
        images: [],
        address: '164 N Hamel Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/45._Main_6414_Colgate_Ave_rollfy.jpg',
        label: 'Colgate Ave',
        images: [],
        address: '6414 Colgate Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/44._Main_732_N_McCadden_Pl_xhfgl6.jpg',
        label: 'McCadden Pl',
        images: [],
        address: '732 N McCadden Pl'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/43._Main_1088_N_Hillcrest_Rd_zfsaym.jpg',
        label: 'Hillcrest Rd',
        images: [],
        address: '1088 N Hillcrest Rd'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/42._Main_147_N_Hamel_Dr._c4flfc.jpg',
        label: 'Hamel Dr',
        images: [],
        address: '147 N Hamel Dr.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/41._Main_2260_Hercules_Dr_gidbqs.jpg',
        label: 'Hercules Dr',
        images: [],
        address: '2260 Hercules Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/40._Main_6610_Maryland_Dr._cdnpoe.jpg',
        label: 'Maryland Dr',
        images: [],
        address: '6610 Maryland Dr.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839835/mainSite/privateHomes/thumbs/4._Main_10801_Ashby_f1lcvk.webp',
        label: 'Ashby',
        images: [],
        address: '10801 Ashby'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/39._Main_130_N_Stanley_yie0re.webp',
        label: 'Stanley',
        images: [],
        address: '130 N Stanley'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839826/mainSite/privateHomes/thumbs/38._Main_417_N_Orlando_Ave_mcks05.jpg',
        label: 'Orlando Ave',
        images: [],
        address: '417 N Orlando Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839826/mainSite/privateHomes/thumbs/37._Main_Cheviot_Dr_gznbqr.jpg',
        label: 'Cheviot Dr',
        images: [],
        address: 'Cheviot Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/36._Main_1111_Sierra_Alta_Way_rjtg79.jpg',
        label: 'Sierra Alta Way',
        images: [],
        address: '1111 Sierra Alta Way'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/35._Main_355_S_Mansfield_Ave_iovphs.webp',
        label: 'Mansfield Ave',
        images: [],
        address: '355 S Mansfield Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/34._Main_370_N_June_St_utz49w.jpg',
        label: 'June St',
        images: [],
        address: '370 N June St'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/33._Main_6430_Colgate_Ave_n6cnxp.jpg',
        label: 'Colgate Ave',
        images: [],
        address: '6430 Colgate Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839826/mainSite/privateHomes/thumbs/32._Main_205_S_La_Peer_Dr_uduiso.webp',
        label: 'La Peer Dr',
        images: [],
        address: '205 S La Peer Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/31._Main_6352_Colgate_qvemqh.jpg',
        label: 'Colgate',
        images: [],
        address: '6352 Colgate'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/30._Main_164_N_Stanley_Dr._fszw6r.jpg',
        label: 'Stanley Dr',
        images: [],
        address: '164 N Stanley Dr.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/3._Main_5652_Calvin_Ave_qtezbr.jpg',
        label: 'Calvin Ave',
        images: [],
        address: '5652 Calvin Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/29._Main_346_N_Laurel_Ave_ilyrue.webp',
        label: 'Laurel Ave',
        images: [],
        address: '346 N Laurel Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839826/mainSite/privateHomes/thumbs/28._Main_16037_Junaluska_Way_j7sjzt.webp',
        label: 'Junaluska Way',
        images: [],
        address: '16037 Junaluska Way'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/27._836.Main_S_Manning_Ave_ejzta9.jpg',
        label: 'Manning Ave',
        images: [],
        address: 'S Manning Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/26._Main_423_S_Mansfield_Ave._b8i2d2.jpg',
        label: 'Mansfield Ave',
        images: [],
        address: '423 S Mansfield Ave.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/25._Main_6242_Drexel_Ave_gph3jc.jpg',
        label: 'Drexel Ave',
        images: [],
        address: '6242 Drexel Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/24._Main_2244_Stanley_Ave._v3bnqs.jpg',
        label: 'Stanley Ave',
        images: [],
        address: '2244 Stanley Ave.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/23._Main_735_N_Las_Palmas_Ave_gghqbz.jpg',
        label: 'Las Palmas Ave',
        images: [],
        address: '735 N Las Palmas Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/22._Main_354_N_San_Vicente_Blvd_msx5np.jpg',
        label: 'San Vicente Blvd',
        images: [],
        address: '354 N San Vicente Blvd'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/21._Main_6516_Maryland_Dr._jhqeha.jpg',
        label: 'Maryland Dr',
        images: [],
        address: '6516 Maryland Dr.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839822/mainSite/privateHomes/thumbs/20._Main_18296_Karen_Dr._kvqnat.jpg',
        label: 'Karen Dr',
        images: [],
        address: '18296 Karen Dr.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/2._Main_Coyne_Ave_cjnfsg.jpg',
        label: 'Coyne Ave',
        images: [],
        address: '12018 Coyne St'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/19._Main_800_Harper_lejrbo.webp',
        label: 'Harper',
        images: [],
        address: '800 N Harper'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/18._Main_846_Huntley_Dr_pqd6ix.webp',
        label: 'Huntley Dr',
        images: [],
        address: '846 Huntley Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/17._Main_6230_Fifth_St._xxun6r.webp',
        label: 'Fifth St',
        images: [],
        address: '6230 Fifth St.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/16._Main_6357_Fifth_St._iddce7.webp',
        label: 'Fifth St',
        images: [],
        address: '6357 Fifth St.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/15._Main_2463_Achilles_Dr._lipyu9.webp',
        label: 'Achilles Dr',
        images: [],
        address: '2463 Achilles Dr.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/14._Main_5087_Marmol_De_jrqx0u.webp',
        label: 'Marmol Dr',
        images: [],
        address: '5087 Marmol Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/13._Main_1918_West_Holme_Ave_hijeao.webp',
        label: 'West Holme Ave',
        images: [],
        address: '1918 West Holme Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839837/mainSite/privateHomes/thumbs/12._Main_6140_Club_Dr_hc4uxv.webp',
        label: 'Club Dr',
        images: [],
        address: '6140 Club Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839836/mainSite/privateHomes/thumbs/11._main_350_S_McCarty_Dr_mzqx2c.webp',
        label: 'Mc Carty Dr',
        images: [],
        address: 'S Mc Carty Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839836/mainSite/privateHomes/thumbs/10._Main_351_N_Laurel_Ave_daqrsl.webp',
        label: 'Laurel Ave',
        images: [],
        address: '351 N Laurel Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/1._Main_531_Curson_Ave_uct1ts.jpg',
        label: 'Curson Ave',
        images: [],
        address: '531 Curson Ave'
    }
]
let ii = 0
const keys = Object.keys(privateHomesObj)
const newObj = {}
images.forEach((v, i) => {
    const reg = new RegExp(v.address.replace(/\./ig, ""), "ig")
    const find = keys.find((key) => {
        key = key.replace(/\./ig, "")
        if (key.match(reg)) {
            return key
        }
    })

    if (find) {
        newObj[find] = {
            ...v,
            images: privateHomesObj[find]
        }

    }

})
let data = JSON.stringify(newObj);
fs.writeFileSync('privateHomeFinal.json', data);