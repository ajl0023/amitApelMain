const fs = require('fs')
const privateHomes = require('./privateHomeFinal4.json')
const keys = Object.keys(privateHomes)

const thumbs = [{
        filename: '93._Main_8720_Rosewood_arwel3',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839835/mainSite/privateHomes/thumbs/93._Main_8720_Rosewood_arwel3.webp',
        address: '8720 Rosewood'
    },
    {
        filename: '9._Main_320_N_La_Jolla_Ave_rdx1i5',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839837/mainSite/privateHomes/thumbs/9._Main_320_N_La_Jolla_Ave_rdx1i5.webp',
        address: '320 N La Jolla Ave'
    },
    {
        filename: '87._Main_16366_Sloan_qfyoqc',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/87._Main_16366Sloan_qfyoqc.webp',
        address: '16366 W. Sloan Dr'
    },
    {
        filename: '80._Main_428_N_La_Jolla_hvrhsu',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/80._Main_428NLaJolla_hvrhsu.jpg',
        address: '428 N La Jolla'
    },
    {
        filename: '8._Main_3142_Danny_Hill_Dr_jdpjsd',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839836/mainSite/privateHomes/thumbs/8._Main_3142_Danny_Hill_Dr_jdpjsd.webp',
        address: '3142 Dannyhill Dr'
    },
    {
        filename: '79.Main_1845_Coldwater_pj1wbf',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/79.Main1845Coldwater_pj1wbf.jpg',
        address: '1845 Coldwater'
    },
    {
        filename: '78._Mail_8971_W_Shoreham_ghbdgu',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/78._Mail_8971_W_Shoreham_ghbdgu.jpg',
        address: '8971 W. Shoreham'
    },
    {
        filename: '77._Main_1349_N_Gardner_al3joa',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/77._Main_1349_N_Gardner_al3joa.jpg',
        address: '1349 N Gardner'
    },
    {
        filename: '76._Main_152_S_Laurel_bkchip',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/76._Main_152_S_Laurel_bkchip.jpg',
        address: '152 S Laurel Ave'
    },
    {
        filename: '75._Main_527_N_Harper_dmrio3',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/75._Main_527_N_Harper_dmrio3.jpg',
        address: '527 N Harper'
    },

    {
        filename: '73._Main_312_La_Peer_io0jrx',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/73._Main_312_La_Peer_io0jrx.jpg',
        address: '312 S La Peer'
    },
    {
        filename: '72._Main_8381_Hollywood_Blvd_htjdu1',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/72._Main_8381_Hollywood_Blvd_htjdu1.jpg',
        address: '8381 Hollywood Blvd'
    },
    {
        filename: '71._Main_824_N_La_Jolla_Ave_svuf0i',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/71._Main_824_N_La_Jolla_Ave_svuf0i.jpg',
        address: '824 N La Jolla Ave'
    },
    {
        filename: '70._Main_349_S._Mansfield_Ave._dscjv9',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839833/mainSite/privateHomes/thumbs/70._Main_349_S._Mansfield_Ave._dscjv9.webp',
        address: '349 S Mansfield Ave'
    },
    {
        filename: '7._Main_424_La_Jolla_Ave_cskfeg',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839835/mainSite/privateHomes/thumbs/7._Main_424_La_Jolla_Ave_cskfeg.webp',
        address: '424 La Jolla Ave'
    },
    {
        filename: '69._Main_12117_Greenock_Ave_dn1sll',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/69._Main_12117_Greenock_Ave_dn1sll.jpg',
        address: '12117 Greenock Ave'
    },
    {
        filename: '68._Main_1484_Edris_Dr_znkrey',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/68._Main_1484_Edris_Dr_znkrey.jpg',
        address: '1484 Edris Dr'
    },
    {
        filename: '67._Main_815_Tigertail_xkqzgg',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839832/mainSite/privateHomes/thumbs/67._Main_815_Tigertail_xkqzgg.webp',
        address: '815 Tigertail'
    },
    {
        filename: '66._Main_4439_Stansbury_ytsw0k',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/66._Main_4439_Stansbury_ytsw0k.jpg',
        address: '4439 Stansbury'
    },
    {
        filename: '65._Main_405_N_Kilkea_kfnhhl',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/65._Main_405_N_Kilkea_kfnhhl.webp',
        address: '405 N Kilkea'
    },
    {
        filename: '64._Main_524_Ocampo_bfzjim',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/64._Main_524_Ocampo_bfzjim.jpg',
        address: '524 Ocampo'
    },
    {
        filename: '63._Main_255_Bernard_Ave_ws0arq',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/63._Main_255_Bernard_Ave_ws0arq.jpg',
        address: '255 Bernard Ave'
    },
    {
        filename: '62._Main_13020_Greenleaf_jobqgc',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/62._Main_13020_Greenleaf_jobqgc.webp',
        address: '13020 Greenleaf'
    },
    {
        filename: '61._Main_9401_Sawyer_St_dbl6sf',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/61._Main_9401_Sawyer_St_dbl6sf.webp',
        address: '9401 Sawyer St'
    },
    {
        filename: '60._Main_641_Mildred_Ave_kalguc',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/60._Main_641_Mildred_Ave_kalguc.webp',
        address: '641 Mildred Ave'
    },
    {
        filename: '6._Main_535_West_Knoll_Dr._i0fyln',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839836/mainSite/privateHomes/thumbs/6._Main_535_West_Knoll_Dr._i0fyln.webp',
        address: '535 West Knoll Dr.'
    },
    {
        filename: '59._Main_2351_Mt_Olympus_k9zmm0',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/59._Main_2351_Mt_Olympus_k9zmm0.jpg',
        address: '2351 Mt Olympus'
    },
    {
        filename: '58._Main_3114_Elvido_Dr_wbb6qf',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839831/mainSite/privateHomes/thumbs/58._Main_3114_Elvido_Dr_wbb6qf.webp',
        address: '3114 Elvido Dr'
    },
    {
        filename: '57._Main_23590_Park_South_St_scxulm',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/57._Main_23590_Park_South_St_scxulm.jpg',
        address: '23590 Park South St'
    },
    {
        filename: '56._Main_1847_Coldwater_Cyn_jxbpj7',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/56._Main_1847_Coldwater_Cyn_jxbpj7.jpg',
        address: '1847 Coldwater Cyn'
    },
    {
        filename: '55._Main_631_Mansfield_Ave_cmksmh',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/55._Main_631_Mansfield_Ave_cmksmh.jpg',
        address: '631 S Mansfield Ave'
    },
    {
        filename: '54._Main_543_N_Kilkea_ggken4',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/54._Main_543_N_Kilkea_ggken4.webp',
        address: '543 N Kilkea Dr'
    },
    {
        filename: '53._Main_9814_Hythe_Ct_lcrqtr',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839830/mainSite/privateHomes/thumbs/53._Main_9814_Hythe_Ct_lcrqtr.webp',
        address: '9814 Hythe Ct'
    },
    {
        filename: '52._Main_813_N_Laurel_Ave_hjpyz2',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/52._Main_813_N_Laurel_Ave_hjpyz2.jpg',
        address: '813 N Laurel Ave'
    },
    {
        filename: '51._Main_733_N_Las_Palmas_Ave_zkjuqi',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839829/mainSite/privateHomes/thumbs/51._Main_733_N_Las_Palmas_Ave_zkjuqi.webp',
        address: '733 N Las Palmas Ave'
    },
    {
        filename: '5._Main_639_Mildred_Ave_q1y8gt',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839835/mainSite/privateHomes/thumbs/5._Main_639_Mildred_Ave_q1y8gt.webp',
        address: '639 Mildred Ave'
    },
    {
        filename: '49._Main_727_N_Las_Palmas_Ave_v2eosj',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/49._Main_727_N_Las_Palmas_Ave_v2eosj.jpg',
        address: '727 N Las Palmas Ave'
    },
    {
        filename: '48._Main_147_N_Stanley_Dr_fc0amt',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/48._Main_147_N_Stanley_Dr_fc0amt.jpg',
        address: '147 N Stanley Dr'
    },
    {
        filename: '47._Main_2240_Stanley_Hills_Dr_uhwgv7',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/47._Main_2240_Stanley_Hills_Dr_uhwgv7.jpg',
        address: '2240 Stanley Hills Dr'
    },
    {
        filename: '46._164_N_Hamel_Dr_y2qe0h',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/46._164_N_Hamel_Dr_y2qe0h.jpg',
        address: '164 N Hamel Dr'
    },
    {
        filename: '45._Main_6414_Colgate_Ave_rollfy',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/45._Main_6414_Colgate_Ave_rollfy.jpg',
        address: '6414 Colgate Ave'
    },
    {
        filename: '44._Main_732_N_McCadden_Pl_xhfgl6',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/44._Main_732_N_McCadden_Pl_xhfgl6.jpg',
        address: '732 N McCadden Pl'
    },
    {
        filename: '43._Main_1088_N_Hillcrest_Rd_zfsaym',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/43._Main_1088_N_Hillcrest_Rd_zfsaym.jpg',
        address: '1088 N Hillcrest Rd'
    },
    {
        filename: '42._Main_147_N_Hamel_Dr._qdqlxf',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634855702/mainSite/privateHomes/thumbs/42._Main_147_N_Hamel_Dr._qdqlxf.jpg',
        address: '147 N Hamel Dr.'
    },
    {
        filename: '42._Main_147_N_Hamel_Dr._c4flfc',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/42._Main_147_N_Hamel_Dr._c4flfc.jpg',
        address: '147 N Hamel Dr.'
    },
    {
        filename: '41._Main_2260_Hercules_Dr_gidbqs',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/41._Main_2260_Hercules_Dr_gidbqs.jpg',
        address: '2260 Hercules Dr'
    },
    {
        filename: '40._Main_6610_Maryland_Dr._cdnpoe',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/40._Main_6610_Maryland_Dr._cdnpoe.jpg',
        address: '6610 Maryland Dr.'
    },
    {
        filename: '4._Main_10801_Ashby_f1lcvk',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839835/mainSite/privateHomes/thumbs/4._Main_10801_Ashby_f1lcvk.webp',
        address: '10801 Ashby'
    },
    {
        filename: '39._Main_130_N_Stanley_yie0re',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/39._Main_130_N_Stanley_yie0re.webp',
        address: '130 N Stanley Dr'
    },
    {
        filename: '38._Main_417_N_Orlando_Ave_mcks05',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839826/mainSite/privateHomes/thumbs/38._Main_417_N_Orlando_Ave_mcks05.jpg',
        address: '417 N Orlando Ave'
    },
    {
        filename: '37._Main_Cheviot_Dr_gznbqr',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839826/mainSite/privateHomes/thumbs/37._Main_Cheviot_Dr_gznbqr.jpg',
        address: 'Cheviot Dr'
    },
    {
        filename: '36._Main_1111_Sierra_Alta_Way_rjtg79',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/36._Main_1111_Sierra_Alta_Way_rjtg79.jpg',
        address: '1111 Sierra Alta Way'
    },
    {
        filename: '35._Main_355_S_Mansfield_Ave_iovphs',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839828/mainSite/privateHomes/thumbs/35._Main_355_S_Mansfield_Ave_iovphs.webp',
        address: '355 S Mansfield Ave'
    },
    {
        filename: '34._Main_370_N_June_St_utz49w',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/34._Main_370_N_June_St_utz49w.jpg',
        address: '370 N June St'
    },
    {
        filename: '33._Main_6430_Colgate_Ave_n6cnxp',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839827/mainSite/privateHomes/thumbs/33._Main_6430_Colgate_Ave_n6cnxp.jpg',
        address: '6430 Colgate Ave'
    },
    {
        filename: '32._Main_205_S_La_Peer_Dr_uduiso',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839826/mainSite/privateHomes/thumbs/32._Main_205_S_La_Peer_Dr_uduiso.webp',
        address: '205 S La Peer Dr'
    },
    {
        filename: '31._Main_6352_Colgate_qvemqh',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/31._Main_6352_Colgate_qvemqh.jpg',
        address: '6352 Colgate Ave'
    },
    {
        filename: '30._Main_164_N_Stanley_Dr._fszw6r',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/30._Main_164_N_Stanley_Dr._fszw6r.jpg',
        address: '164 N Stanley Dr.'
    },
    {
        filename: '3._Main_5652_Calvin_Ave_qtezbr',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/3._Main_5652_Calvin_Ave_qtezbr.jpg',
        address: '5652 Calvin Ave'
    },
    {
        filename: '29._Main_346_N_Laurel_Ave_ilyrue',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/29._Main_346_N_Laurel_Ave_ilyrue.webp',
        address: '346 N Laurel Ave'
    },
    {
        filename: '28._Main_16037_Junaluska_Way_j7sjzt',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839826/mainSite/privateHomes/thumbs/28._Main_16037_Junaluska_Way_j7sjzt.webp',
        address: '16037 Junaluska Way'
    },
    {
        filename: '27._836._S_Manning_Ave_pmtsn9',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634855650/mainSite/privateHomes/thumbs/27._836._S_Manning_Ave_pmtsn9.jpg',
        address: '836 S Manning Ave'
    },
    {
        filename: '26._Main_423_S_Mansfield_Ave._b8i2d2',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/26._Main_423_S_Mansfield_Ave._b8i2d2.jpg',
        address: '423 S Mansfield Ave'
    },
    {
        filename: '25._Main_6242_Drexel_Ave_gph3jc',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/25._Main_6242_Drexel_Ave_gph3jc.jpg',
        address: '6242 Drexel Ave'
    },
    {
        filename: '24._Main_2244_Stanley_Ave._v3bnqs',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/24._Main_2244_Stanley_Ave._v3bnqs.jpg',
        address: '2244 Stanley Ave.'
    },
    {
        filename: '23._Main_735_N_Las_Palmas_Ave_gghqbz',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/23._Main_735_N_Las_Palmas_Ave_gghqbz.jpg',
        address: '735 N Las Palmas Ave'
    },
    {
        filename: '22._Main_354_N_San_Vicente_Blvd_msx5np',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/22._Main_354_N_San_Vicente_Blvd_msx5np.jpg',
        address: '354 N San Vicente Blvd'
    },
    {
        filename: '21._Main_6516_Maryland_Dr._jhqeha',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/21._Main_6516_Maryland_Dr._jhqeha.jpg',
        address: '6516 Maryland Dr.'
    },
    {
        filename: '20._Main_18296_Karen_Dr._kvqnat',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839822/mainSite/privateHomes/thumbs/20._Main_18296_Karen_Dr._kvqnat.jpg',
        address: '18296 Karen Dr.'
    },
    {
        filename: '2._Main_Coyne_Ave_cjnfsg',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/2._Main_Coyne_Ave_cjnfsg.jpg',
        address: '12018 Coyne St'
    },
    {
        filename: '19._Main_800_Harper_lejrbo',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/19._Main_800_Harper_lejrbo.webp',
        address: '800 N Harper'
    },
    {
        filename: '18._Main_846_Huntley_Dr_pqd6ix',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839825/mainSite/privateHomes/thumbs/18._Main_846_Huntley_Dr_pqd6ix.webp',
        address: '846 Huntley Dr'
    },
    {
        filename: '17._Main_6230_Fifth_St._xxun6r',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/17._Main_6230_Fifth_St._xxun6r.webp',
        address: '6230 Fifth St.'
    },
    {
        filename: '16._Main_6357_Fifth_St._iddce7',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/16._Main_6357_Fifth_St._iddce7.webp',
        address: '6357 Fifth St.'
    },
    {
        filename: '15._Main_2463_Achilles_Dr._lipyu9',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839824/mainSite/privateHomes/thumbs/15._Main_2463_Achilles_Dr._lipyu9.webp',
        address: '2463 Achilles Dr.'
    },
    {
        filename: '14._Main_5087_Marmol_De_jrqx0u',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/14._Main_5087_Marmol_De_jrqx0u.webp',
        address: '5087 Marmol Dr'
    },
    {
        filename: '13._Main_1918_West_Holme_Ave_hijeao',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839823/mainSite/privateHomes/thumbs/13._Main_1918_West_Holme_Ave_hijeao.webp',
        address: '1918 West Holme Ave'
    },

    {
        filename: '11._main_350_S_McCarty_Dr_mzqx2c',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839836/mainSite/privateHomes/thumbs/11._main_350_S_McCarty_Dr_mzqx2c.webp',
        address: '350 S Mc Carty Dr'
    },
    {
        filename: '10._Main_351_N_Laurel_Ave_daqrsl',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839836/mainSite/privateHomes/thumbs/10._Main_351_N_Laurel_Ave_daqrsl.webp',
        address: '351 N Laurel Ave'
    },
    {
        filename: '1._Main_531_Curson_Ave_uct1ts',
        url: 'http://res.cloudinary.com/dt4xntymn/image/upload/v1634839834/mainSite/privateHomes/thumbs/1._Main_531_Curson_Ave_uct1ts.jpg',
        address: '531 Curson Ave'
    }
]

let ii = 0
// for (let thumb of thumbs) {

//     const fileN = thumb.filename.replace(/main/ig, "")
//     const split = fileN.split("_")
//     const sliced = split.slice(1, split.length - 1).filter((v) => {
//         return v.length > 0
//     })
//     const joined = sliced.join(" ")
//     const find = keys.find((key) => {
//         const regex = new RegExp(key, "gi")
//         return thumb.address.match(regex)
//     })

//     if (find || privateHomes[thumb.address]) {

//         privateHomes[find || thumb.address] = {
//             label: "",
//             thumb: thumb.url,
//             images: privateHomes[find || thumb.address]
//         }



//     }

// }


const arr = []
for (let i in privateHomes) {
    if (privateHomes[i].thumb) {
        privateHomes[i].label = i.replace(/[0-9]/ig, "").trim()
    }
    arr.push({
        label: privateHomes[i].label,
        thumb: privateHomes[i].thumb,
        address: i
    })
}
console.log(arr)
// let data = JSON.stringify(privateHomes);
// fs.writeFileSync('privateHomeFinal4.json', data);