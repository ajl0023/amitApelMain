const fs = require('fs');
const privateHomes = require('./pHomes1.json');

const images = [{
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839835/mainSite/privateHomes/thumbs/93._Main_8720_Rosewood_arwel3.webp',
        label: 'Rosewood',
        images: [],
        sliced: '8720 Rosewood'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839837/mainSite/privateHomes/thumbs/9._Main_320_N_La_Jolla_Ave_rdx1i5.webp',
        label: 'La Jolla Ave',
        images: [],
        sliced: '320 N La Jolla Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/87._Main_16366_Sloan_qfyoqc.webp',
        label: 'Sloan',
        images: [],
        sliced: '16366 Sloan'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/80._Main_428_N_La_Jolla_hvrhsu.jpg',
        label: 'NLaJolla',
        images: [],
        sliced: '428 N La Jolla'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839836/mainSite/privateHomes/thumbs/8._Main_3142_Danny_Hill_Dr_jdpjsd.webp',
        label: 'Danny Hill Dr',
        images: [],
        sliced: '3142 Danny Hill Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/79._Main_1845_Coldwater_pj1wbf.jpg',
        label: 'Coldwater',
        images: [],
        sliced: '1845 Coldwater'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/78._Main_8971_W_Shoreham_ghbdgu.jpg',
        label: 'Shoreham',
        images: [],
        sliced: '8971 W Shoreham'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/77._Main_1349_N_Gardner_al3joa.jpg',
        label: 'Gardner',
        images: [],
        sliced: '1349 N Gardner'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/76._Main_152_S_Laurel_bkchip.jpg',
        label: 'Laurel',
        images: [],
        sliced: '152 S Laurel'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/75._Main_527_N_Harper_dmrio3.jpg',
        label: 'Harper',
        images: [],
        sliced: '527 N Harper'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/74._Main_527_N_Harper_xsxkms.jpg',
        label: 'Harper',
        images: [],
        sliced: '527 N Harper'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/73._Main_312_La_Peer_io0jrx.jpg',
        label: 'La Peer',
        images: [],
        sliced: '312 La Peer'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/72._Main_8381_Hollywood_Blvd_htjdu1.jpg',
        label: 'Hollywood Blvd',
        images: [],
        sliced: '8381 Hollywood Blvd'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/71._Main_824_N_La_Jolla_Ave_svuf0i.jpg',
        label: 'La Jolla Ave',
        images: [],
        sliced: '824 N La Jolla Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/70._Main_349_S._Mansfield_Ave._dscjv9.webp',
        label: 'S Mansfield Ave',
        images: [],
        sliced: '349 S. Mansfield Ave.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839835/mainSite/privateHomes/thumbs/7._Main_424_La_Jolla_Ave_cskfeg.webp',
        label: 'La Jolla Ave',
        images: [],
        sliced: '424 La Jolla Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/69._Main_12117_Greenock_Ave_dn1sll.jpg',
        label: 'Greenock Ave',
        images: [],
        sliced: '12117 Greenock Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/68._Main_1484_Edris_Dr_znkrey.jpg',
        label: 'Edris Dr',
        images: [],
        sliced: '1484 Edris Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/67._Main_815_Tigertail_xkqzgg.webp',
        label: 'Tigertail',
        images: [],
        sliced: '815 Tigertail'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/66._Main_4439_Stansbury_ytsw0k.jpg',
        label: 'Stansbury',
        images: [],
        sliced: '4439 Stansbury'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/65._Main_405_N_Kilkea_kfnhhl.webp',
        label: 'Kilkea',
        images: [],
        sliced: '405 N Kilkea'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/64._Main_524_Ocampo_bfzjim.jpg',
        label: 'Ocampo',
        images: [],
        sliced: '524 Ocampo'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/63._Main_255_Bernard_Ave_ws0arq.jpg',
        label: 'Bernard Ave',
        images: [],
        sliced: '255 Bernard Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/62._Main_13020_Greenleaf_jobqgc.webp',
        label: 'Greenleaf',
        images: [],
        sliced: '13020 Greenleaf'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/61._Main_9401_Sawyer_St_dbl6sf.webp',
        label: 'Sawyer St',
        images: [],
        sliced: '9401 Sawyer St'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/60._Main_641_Mildred_Ave_kalguc.webp',
        label: 'Mildred Ave',
        images: [],
        sliced: '641 Mildred Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839836/mainSite/privateHomes/thumbs/6._Main_535_West_Knoll_Dr._i0fyln.webp',
        label: 'West Knoll Dr',
        images: [],
        sliced: '535 West Knoll Dr.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/59._Main_2351_Mt_Olympus_k9zmm0.jpg',
        label: 'Mt Olympus',
        images: [],
        sliced: '2351 Mt Olympus'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/58._Main_3114_Elvido_Dr_wbb6qf.webp',
        label: 'Elvido Dr',
        images: [],
        sliced: '3114 Elvido Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/57._Main_23590_Park_South_St_scxulm.jpg',
        label: 'Park South St',
        images: [],
        sliced: '23590 Park South St'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/56._Main_1847_Coldwater_Cyn_jxbpj7.jpg',
        label: 'Coldwater Cyn',
        images: [],
        sliced: '1847 Coldwater Cyn'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/55._Main_631_Mansfield_Ave_cmksmh.jpg',
        label: 'Mansfield Ave',
        images: [],
        sliced: '631 Mansfield Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/54._Main_543_N_Kilkea_ggken4.webp',
        label: 'Kilkea',
        images: [],
        sliced: '543 N Kilkea'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/53._Main_9814_Hythe_Ct_lcrqtr.webp',
        label: 'Hythe Ct',
        images: [],
        sliced: '9814 Hythe Ct'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/52._Main_813_N_Laurel_Ave_hjpyz2.jpg',
        label: 'Laurel Ave',
        images: [],
        sliced: '813 N Laurel Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839829/mainSite/privateHomes/thumbs/51._Main_733_N_Las_Palmas_Ave_zkjuqi.webp',
        label: 'Las Palmas Ave',
        images: [],
        sliced: '733 N Las Palmas Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839835/mainSite/privateHomes/thumbs/5._Main_639_Mildred_Ave_q1y8gt.webp',
        label: 'Mildred Ave',
        images: [],
        sliced: '639 Mildred Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/49._Main_727_N_Las_Palmas_Ave_v2eosj.jpg',
        label: 'Las Palmas Ave',
        images: [],
        sliced: '727 N Las Palmas Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/48._Main_147_N_Stanley_Dr_fc0amt.jpg',
        label: 'Stanley Dr',
        images: [],
        sliced: '147 N Stanley Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/47._Main_2240_Stanley_Hills_Dr_uhwgv7.jpg',
        label: 'Stanley Hills Dr',
        images: [],
        sliced: '2240 Stanley Hills Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/46._Main_164_N_Hamel_Dr_y2qe0h.jpg',
        label: 'Hamel Dr',
        images: [],
        sliced: '164 N Hamel Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/45._Main_6414_Colgate_Ave_rollfy.jpg',
        label: 'Colgate Ave',
        images: [],
        sliced: '6414 Colgate Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/44._Main_732_N_McCadden_Pl_xhfgl6.jpg',
        label: 'McCadden Pl',
        images: [],
        sliced: '732 N McCadden Pl'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/43._Main_1088_N_Hillcrest_Rd_zfsaym.jpg',
        label: 'Hillcrest Rd',
        images: [],
        sliced: '1088 N Hillcrest Rd'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/42._Main_147_N_Hamel_Dr._c4flfc.jpg',
        label: 'Hamel Dr',
        images: [],
        sliced: '147 N Hamel Dr.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/41._Main_2260_Hercules_Dr_gidbqs.jpg',
        label: 'Hercules Dr',
        images: [],
        sliced: '2260 Hercules Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/40._Main_6610_Maryland_Dr._cdnpoe.jpg',
        label: 'Maryland Dr',
        images: [],
        sliced: '6610 Maryland Dr.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839835/mainSite/privateHomes/thumbs/4._Main_10801_Ashby_f1lcvk.webp',
        label: 'Ashby',
        images: [],
        sliced: '10801 Ashby'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/39._Main_130_N_Stanley_yie0re.webp',
        label: 'Stanley',
        images: [],
        sliced: '130 N Stanley'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839826/mainSite/privateHomes/thumbs/38._Main_417_N_Orlando_Ave_mcks05.jpg',
        label: 'Orlando Ave',
        images: [],
        sliced: '417 N Orlando Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839826/mainSite/privateHomes/thumbs/37._Main_Cheviot_Dr_gznbqr.jpg',
        label: 'Cheviot Dr',
        images: [],
        sliced: 'Cheviot Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/36._Main_1111_Sierra_Alta_Way_rjtg79.jpg',
        label: 'Sierra Alta Way',
        images: [],
        sliced: '1111 Sierra Alta Way'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/35._Main_355_S_Mansfield_Ave_iovphs.webp',
        label: 'Mansfield Ave',
        images: [],
        sliced: '355 S Mansfield Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/34._Main_370_N_June_St_utz49w.jpg',
        label: 'June St',
        images: [],
        sliced: '370 N June St'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/33._Main_6430_Colgate_Ave_n6cnxp.jpg',
        label: 'Colgate Ave',
        images: [],
        sliced: '6430 Colgate Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839826/mainSite/privateHomes/thumbs/32._Main_205_S_La_Peer_Dr_uduiso.webp',
        label: 'La Peer Dr',
        images: [],
        sliced: '205 S La Peer Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/31._Main_6352_Colgate_qvemqh.jpg',
        label: 'Colgate',
        images: [],
        sliced: '6352 Colgate'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/30._Main_164_N_Stanley_Dr._fszw6r.jpg',
        label: 'Stanley Dr',
        images: [],
        sliced: '164 N Stanley Dr.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/3._Main_5652_Calvin_Ave_qtezbr.jpg',
        label: 'Calvin Ave',
        images: [],
        sliced: '5652 Calvin Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/29._Main_346_N_Laurel_Ave_ilyrue.webp',
        label: 'Laurel Ave',
        images: [],
        sliced: '346 N Laurel Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839826/mainSite/privateHomes/thumbs/28._Main_16037_Junaluska_Way_j7sjzt.webp',
        label: 'Junaluska Way',
        images: [],
        sliced: '16037 Junaluska Way'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/27._836.Main_S_Manning_Ave_ejzta9.jpg',
        label: 'Manning Ave',
        images: [],
        sliced: 'S Manning Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/26._Main_423_S_Mansfield_Ave._b8i2d2.jpg',
        label: 'Mansfield Ave',
        images: [],
        sliced: '423 S Mansfield Ave.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/25._Main_6242_Drexel_Ave_gph3jc.jpg',
        label: 'Drexel Ave',
        images: [],
        sliced: '6242 Drexel Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/24._Main_2244_Stanley_Ave._v3bnqs.jpg',
        label: 'Stanley Ave',
        images: [],
        sliced: '2244 Stanley Ave.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/23._Main_735_N_Las_Palmas_Ave_gghqbz.jpg',
        label: 'Las Palmas Ave',
        images: [],
        sliced: '735 N Las Palmas Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/22._Main_354_N_San_Vicente_Blvd_msx5np.jpg',
        label: 'San Vicente Blvd',
        images: [],
        sliced: '354 N San Vicente Blvd'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/21._Main_6516_Maryland_Dr._jhqeha.jpg',
        label: 'Maryland Dr',
        images: [],
        sliced: '6516 Maryland Dr.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839822/mainSite/privateHomes/thumbs/20._Main_18296_Karen_Dr._kvqnat.jpg',
        label: 'Karen Dr',
        images: [],
        sliced: '18296 Karen Dr.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/2._Main_Coyne_Ave_cjnfsg.jpg',
        label: 'Coyne Ave',
        images: [],
        sliced: 'Coyne Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/19._Main_800_Harper_lejrbo.webp',
        label: 'Harper',
        images: [],
        sliced: '800 Harper'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/18._Main_846_Huntley_Dr_pqd6ix.webp',
        label: 'Huntley Dr',
        images: [],
        sliced: '846 Huntley Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/17._Main_6230_Fifth_St._xxun6r.webp',
        label: 'Fifth St',
        images: [],
        sliced: '6230 Fifth St.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/16._Main_6357_Fifth_St._iddce7.webp',
        label: 'Fifth St',
        images: [],
        sliced: '6357 Fifth St.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/15._Main_2463_Achilles_Dr._lipyu9.webp',
        label: 'Achilles Dr',
        images: [],
        sliced: '2463 Achilles Dr.'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/14._Main_5087_Marmol_De_jrqx0u.webp',
        label: 'Marmol De',
        images: [],
        sliced: '5087 Marmol De'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/13._Main_1918_West_Holme_Ave_hijeao.webp',
        label: 'West Holme Ave',
        images: [],
        sliced: '1918 West Holme Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839837/mainSite/privateHomes/thumbs/12._Main_6140_Club_Dr_hc4uxv.webp',
        label: 'Club Dr',
        images: [],
        sliced: '6140 Club Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839836/mainSite/privateHomes/thumbs/11._main_350_S_McCarty_Dr_mzqx2c.webp',
        label: 'McCarty Dr',
        images: [],
        sliced: '350 S McCarty Dr'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839836/mainSite/privateHomes/thumbs/10._Main_351_N_Laurel_Ave_daqrsl.webp',
        label: 'Laurel Ave',
        images: [],
        sliced: '351 N Laurel Ave'
    },
    {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/1._Main_531_Curson_Ave_uct1ts.jpg',
        label: 'Curson Ave',
        images: [],
        sliced: '531 Curson Ave'
    }
]

const privateHomesObj = {
    Rosewood: {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839835/mainSite/privateHomes/thumbs/93._Main_8720_Rosewood_arwel3.webp',
        label: 'Rosewood',
        images: [],
        sliced: '8720 Rosewood',
        match: '8720 Rosewood'
    },
    'La Jolla Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839835/mainSite/privateHomes/thumbs/7._Main_424_La_Jolla_Ave_cskfeg.webp',
        label: 'La Jolla Ave',
        images: [],
        sliced: '424 La Jolla Ave',
        match: '424 La Jolla Ave'
    },
    Sloan: {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/87._Main_16366_Sloan_qfyoqc.webp',
        label: 'Sloan',
        images: [],
        sliced: '16366 Sloan',
        match: '16366 Sloan'
    },
    NLaJolla: {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/80._Main_428_N_La_Jolla_hvrhsu.jpg',
        label: 'NLaJolla',
        images: [],
        sliced: '428 N La Jolla',
        match: '428 N La Jolla'
    },
    'Danny Hill Dr': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839836/mainSite/privateHomes/thumbs/8._Main_3142_Danny_Hill_Dr_jdpjsd.webp',
        label: 'Danny Hill Dr',
        images: [],
        sliced: '3142 Danny Hill Dr',
        match: '3142 Danny Hill Dr'
    },
    Coldwater: {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/79._Main_1845_Coldwater_pj1wbf.jpg',
        label: 'Coldwater',
        images: [],
        sliced: '1845 Coldwater',
        match: '1845 Coldwater'
    },
    Shoreham: {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/78._Main_8971_W_Shoreham_ghbdgu.jpg',
        label: 'Shoreham',
        images: [],
        sliced: '8971 W Shoreham',
        match: '8971 W Shoreham'
    },
    Gardner: {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/77._Main_1349_N_Gardner_al3joa.jpg',
        label: 'Gardner',
        images: [],
        sliced: '1349 N Gardner',
        match: '1349 N Gardner'
    },
    Laurel: {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/76._Main_152_S_Laurel_bkchip.jpg',
        label: 'Laurel',
        images: [],
        sliced: '152 S Laurel',
        match: '152 S Laurel'
    },
    Harper: {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/19._Main_800_Harper_lejrbo.webp',
        label: 'Harper',
        images: [],
        sliced: '800 Harper',
        match: '800 Harper'
    },
    'La Peer': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/73._Main_312_La_Peer_io0jrx.jpg',
        label: 'La Peer',
        images: [],
        sliced: '312 La Peer',
        match: '312 La Peer'
    },
    'Hollywood Blvd': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/72._Main_8381_Hollywood_Blvd_htjdu1.jpg',
        label: 'Hollywood Blvd',
        images: [],
        sliced: '8381 Hollywood Blvd',
        match: '8381 Hollywood Blvd'
    },
    'S Mansfield Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/70._Main_349_S._Mansfield_Ave._dscjv9.webp',
        label: 'S Mansfield Ave',
        images: [],
        sliced: '349 S. Mansfield Ave.',
        match: '349 S. Mansfield Ave.'
    },
    'Greenock Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/69._Main_12117_Greenock_Ave_dn1sll.jpg',
        label: 'Greenock Ave',
        images: [],
        sliced: '12117 Greenock Ave',
        match: '12117 Greenock Ave'
    },
    'Edris Dr': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/68._Main_1484_Edris_Dr_znkrey.jpg',
        label: 'Edris Dr',
        images: [],
        sliced: '1484 Edris Dr',
        match: '1484 Edris Dr'
    },
    Tigertail: {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/67._Main_815_Tigertail_xkqzgg.webp',
        label: 'Tigertail',
        images: [],
        sliced: '815 Tigertail',
        match: '815 Tigertail'
    },
    Stansbury: {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/66._Main_4439_Stansbury_ytsw0k.jpg',
        label: 'Stansbury',
        images: [],
        sliced: '4439 Stansbury',
        match: '4439 Stansbury'
    },
    Kilkea: {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/54._Main_543_N_Kilkea_ggken4.webp',
        label: 'Kilkea',
        images: [],
        sliced: '543 N Kilkea',
        match: '543 N Kilkea'
    },
    Ocampo: {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/64._Main_524_Ocampo_bfzjim.jpg',
        label: 'Ocampo',
        images: [],
        sliced: '524 Ocampo',
        match: '524 Ocampo'
    },
    'Bernard Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/63._Main_255_Bernard_Ave_ws0arq.jpg',
        label: 'Bernard Ave',
        images: [],
        sliced: '255 Bernard Ave',
        match: '255 Bernard Ave'
    },
    Greenleaf: {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/62._Main_13020_Greenleaf_jobqgc.webp',
        label: 'Greenleaf',
        images: [],
        sliced: '13020 Greenleaf',
        match: '13020 Greenleaf'
    },
    'Sawyer St': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/61._Main_9401_Sawyer_St_dbl6sf.webp',
        label: 'Sawyer St',
        images: [],
        sliced: '9401 Sawyer St',
        match: '9401 Sawyer St'
    },
    'Mildred Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839835/mainSite/privateHomes/thumbs/5._Main_639_Mildred_Ave_q1y8gt.webp',
        label: 'Mildred Ave',
        images: [],
        sliced: '639 Mildred Ave',
        match: '639 Mildred Ave'
    },
    'West Knoll Dr': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839836/mainSite/privateHomes/thumbs/6._Main_535_West_Knoll_Dr._i0fyln.webp',
        label: 'West Knoll Dr',
        images: [],
        sliced: '535 West Knoll Dr.',
        match: '535 West Knoll Dr.'
    },
    'Mt Olympus': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/59._Main_2351_Mt_Olympus_k9zmm0.jpg',
        label: 'Mt Olympus',
        images: [],
        sliced: '2351 Mt Olympus',
        match: '2351 Mt Olympus'
    },
    'Elvido Dr': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/58._Main_3114_Elvido_Dr_wbb6qf.webp',
        label: 'Elvido Dr',
        images: [],
        sliced: '3114 Elvido Dr',
        match: '3114 Elvido Dr'
    },
    'Park South St': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/57._Main_23590_Park_South_St_scxulm.jpg',
        label: 'Park South St',
        images: [],
        sliced: '23590 Park South St',
        match: '23590 Park South St'
    },
    'Coldwater Cyn': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/56._Main_1847_Coldwater_Cyn_jxbpj7.jpg',
        label: 'Coldwater Cyn',
        images: [],
        sliced: '1847 Coldwater Cyn',
        match: '1847 Coldwater Cyn'
    },
    'Mansfield Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/26._Main_423_S_Mansfield_Ave._b8i2d2.jpg',
        label: 'Mansfield Ave',
        images: [],
        sliced: '423 S Mansfield Ave.',
        match: '423 S Mansfield Ave.'
    },
    'Hythe Ct': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/53._Main_9814_Hythe_Ct_lcrqtr.webp',
        label: 'Hythe Ct',
        images: [],
        sliced: '9814 Hythe Ct',
        match: '9814 Hythe Ct'
    },
    'Laurel Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839836/mainSite/privateHomes/thumbs/10._Main_351_N_Laurel_Ave_daqrsl.webp',
        label: 'Laurel Ave',
        images: [],
        sliced: '351 N Laurel Ave',
        match: '351 N Laurel Ave'
    },
    'Las Palmas Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/23._Main_735_N_Las_Palmas_Ave_gghqbz.jpg',
        label: 'Las Palmas Ave',
        images: [],
        sliced: '735 N Las Palmas Ave',
        match: '735 N Las Palmas Ave'
    },
    'Stanley Dr': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/30._Main_164_N_Stanley_Dr._fszw6r.jpg',
        label: 'Stanley Dr',
        images: [],
        sliced: '164 N Stanley Dr.',
        match: '164 N Stanley Dr.'
    },
    'Stanley Hills Dr': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/47._Main_2240_Stanley_Hills_Dr_uhwgv7.jpg',
        label: 'Stanley Hills Dr',
        images: [],
        sliced: '2240 Stanley Hills Dr',
        match: '2240 Stanley Hills Dr'
    },
    'Hamel Dr': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/42._Main_147_N_Hamel_Dr._c4flfc.jpg',
        label: 'Hamel Dr',
        images: [],
        sliced: '147 N Hamel Dr.',
        match: '147 N Hamel Dr.'
    },
    'Colgate Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/33._Main_6430_Colgate_Ave_n6cnxp.jpg',
        label: 'Colgate Ave',
        images: [],
        sliced: '6430 Colgate Ave',
        match: '6430 Colgate Ave'
    },
    'McCadden Pl': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/44._Main_732_N_McCadden_Pl_xhfgl6.jpg',
        label: 'McCadden Pl',
        images: [],
        sliced: '732 N McCadden Pl',
        match: '732 N McCadden Pl'
    },
    'Hillcrest Rd': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/43._Main_1088_N_Hillcrest_Rd_zfsaym.jpg',
        label: 'Hillcrest Rd',
        images: [],
        sliced: '1088 N Hillcrest Rd',
        match: '1088 N Hillcrest Rd'
    },
    'Hercules Dr': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/41._Main_2260_Hercules_Dr_gidbqs.jpg',
        label: 'Hercules Dr',
        images: [],
        sliced: '2260 Hercules Dr',
        match: '2260 Hercules Dr'
    },
    'Maryland Dr': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/21._Main_6516_Maryland_Dr._jhqeha.jpg',
        label: 'Maryland Dr',
        images: [],
        sliced: '6516 Maryland Dr.',
        match: '6516 Maryland Dr.'
    },
    Ashby: {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839835/mainSite/privateHomes/thumbs/4._Main_10801_Ashby_f1lcvk.webp',
        label: 'Ashby',
        images: [],
        sliced: '10801 Ashby',
        match: '10801 Ashby'
    },
    Stanley: {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/39._Main_130_N_Stanley_yie0re.webp',
        label: 'Stanley',
        images: [],
        sliced: '130 N Stanley',
        match: '130 N Stanley'
    },
    'Orlando Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839826/mainSite/privateHomes/thumbs/38._Main_417_N_Orlando_Ave_mcks05.jpg',
        label: 'Orlando Ave',
        images: [],
        sliced: '417 N Orlando Ave',
        match: '417 N Orlando Ave'
    },
    'Cheviot Dr': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839826/mainSite/privateHomes/thumbs/37._Main_Cheviot_Dr_gznbqr.jpg',
        label: 'Cheviot Dr',
        images: [],
        sliced: 'Cheviot Dr',
        match: 'Cheviot Dr'
    },
    'Sierra Alta Way': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/36._Main_1111_Sierra_Alta_Way_rjtg79.jpg',
        label: 'Sierra Alta Way',
        images: [],
        sliced: '1111 Sierra Alta Way',
        match: '1111 Sierra Alta Way'
    },
    'June St': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/34._Main_370_N_June_St_utz49w.jpg',
        label: 'June St',
        images: [],
        sliced: '370 N June St',
        match: '370 N June St'
    },
    'La Peer Dr': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839826/mainSite/privateHomes/thumbs/32._Main_205_S_La_Peer_Dr_uduiso.webp',
        label: 'La Peer Dr',
        images: [],
        sliced: '205 S La Peer Dr',
        match: '205 S La Peer Dr'
    },
    Colgate: {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/31._Main_6352_Colgate_qvemqh.jpg',
        label: 'Colgate',
        images: [],
        sliced: '6352 Colgate',
        match: '6352 Colgate'
    },
    'Calvin Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/3._Main_5652_Calvin_Ave_qtezbr.jpg',
        label: 'Calvin Ave',
        images: [],
        sliced: '5652 Calvin Ave',
        match: '5652 Calvin Ave'
    },
    'Junaluska Way': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839826/mainSite/privateHomes/thumbs/28._Main_16037_Junaluska_Way_j7sjzt.webp',
        label: 'Junaluska Way',
        images: [],
        sliced: '16037 Junaluska Way',
        match: '16037 Junaluska Way'
    },
    'Manning Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/27._836.Main_S_Manning_Ave_ejzta9.jpg',
        label: 'Manning Ave',
        images: [],
        sliced: 'S Manning Ave',
        match: 'S Manning Ave'
    },
    'Drexel Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/25._Main_6242_Drexel_Ave_gph3jc.jpg',
        label: 'Drexel Ave',
        images: [],
        sliced: '6242 Drexel Ave',
        match: '6242 Drexel Ave'
    },
    'Stanley Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/24._Main_2244_Stanley_Ave._v3bnqs.jpg',
        label: 'Stanley Ave',
        images: [],
        sliced: '2244 Stanley Ave.',
        match: '2244 Stanley Ave.'
    },
    'San Vicente Blvd': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/22._Main_354_N_San_Vicente_Blvd_msx5np.jpg',
        label: 'San Vicente Blvd',
        images: [],
        sliced: '354 N San Vicente Blvd',
        match: '354 N San Vicente Blvd'
    },
    'Karen Dr': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839822/mainSite/privateHomes/thumbs/20._Main_18296_Karen_Dr._kvqnat.jpg',
        label: 'Karen Dr',
        images: [],
        sliced: '18296 Karen Dr.',
        match: '18296 Karen Dr.'
    },
    'Coyne Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/2._Main_Coyne_Ave_cjnfsg.jpg',
        label: 'Coyne Ave',
        images: [],
        sliced: 'Coyne Ave',
        match: 'Coyne Ave'
    },
    'Huntley Dr': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/18._Main_846_Huntley_Dr_pqd6ix.webp',
        label: 'Huntley Dr',
        images: [],
        sliced: '846 Huntley Dr',
        match: '846 Huntley Dr'
    },
    'Fifth St': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/16._Main_6357_Fifth_St._iddce7.webp',
        label: 'Fifth St',
        images: [],
        sliced: '6357 Fifth St.',
        match: '6357 Fifth St.'
    },
    'Achilles Dr': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/15._Main_2463_Achilles_Dr._lipyu9.webp',
        label: 'Achilles Dr',
        images: [],
        sliced: '2463 Achilles Dr.',
        match: '2463 Achilles Dr.'
    },
    'Marmol De': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/14._Main_5087_Marmol_De_jrqx0u.webp',
        label: 'Marmol De',
        images: [],
        sliced: '5087 Marmol De',
        match: '5087 Marmol De'
    },
    'West Holme Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/13._Main_1918_West_Holme_Ave_hijeao.webp',
        label: 'West Holme Ave',
        images: [],
        sliced: '1918 West Holme Ave',
        match: '1918 West Holme Ave'
    },
    'Club Dr': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839837/mainSite/privateHomes/thumbs/12._Main_6140_Club_Dr_hc4uxv.webp',
        label: 'Club Dr',
        images: [],
        sliced: '6140 Club Dr',
        match: '6140 Club Dr'
    },
    'McCarty Dr': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839836/mainSite/privateHomes/thumbs/11._main_350_S_McCarty_Dr_mzqx2c.webp',
        label: 'McCarty Dr',
        images: [],
        sliced: '350 S McCarty Dr',
        match: '350 S McCarty Dr'
    },
    'Curson Ave': {
        img: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/1._Main_531_Curson_Ave_uct1ts.jpg',
        label: 'Curson Ave',
        images: [],
        sliced: '531 Curson Ave',
        match: '531 Curson Ave'
    }
}
images.map((item) => {

    privateHomesObj[item.label] = item;
    privateHomesObj[item.label]['images'] = []
    // privateHomesObj[item.label]['match'] =
    const name = item.img.split("/")[10]
    const removeMain = name.replace(/[0-9]+\./ig, "").replace(/_main_/ig, "").split("_")
    const sliced = removeMain.slice(0, removeMain.length - 1).join(" ")
    item.match = sliced
    return item




})
const obj2 = {}
privateHomes.forEach((item) => {
    const name = item.img.split("/")
    const rawName = name[11].split("-")[0].split("_").join(" ")
    if (!obj2[rawName]) {
        obj2[rawName] = [item.img]
    } else {
        obj2[rawName].push(item.img)
    }



})
console.log(privateHomes.length)
let data = JSON.stringify(obj2);
fs.writeFileSync('privateHomesArr.json', data);