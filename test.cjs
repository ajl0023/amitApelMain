const images = [
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389432/mainSite/art/ARTPIECE9_mgw6kg.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389435/mainSite/art/ARTPIECE8_x1ynix.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389433/mainSite/art/ARTPIECE7_uij612.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389432/mainSite/art/ARTPIECE6_kwr3hu.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389436/mainSite/art/ARTPIECE5_ruxuj2.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389436/mainSite/art/ARTPIECE4_lvcqgz.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389431/mainSite/art/ARTPIECE3_q2jtpw.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389436/mainSite/art/ARTPIECE2_ixmozr.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389431/mainSite/art/ARTPIECE1_hoikr8.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389433/mainSite/art/ARTPIECE15WALKING_i3eurg.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389432/mainSite/art/ARTPIECE14TREEOFLIFE_xwakxe.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389436/mainSite/art/ARTPIECE13_dnc8jg.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389436/mainSite/art/ARTPIECE13_1_apbfeo.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389432/mainSite/art/ARTPIECE12_oaffuu.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389432/mainSite/art/ARTPIECE11_nekqk6.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389432/mainSite/art/ARTPIECE10_iesftj.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389435/mainSite/art/8w_zxv83h.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389433/mainSite/art/7w_bjtyr3.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389435/mainSite/art/6w_kq1o9t.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389433/mainSite/art/68w_cw9unr.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389433/mainSite/art/67w_xdtgap.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389434/mainSite/art/66w_dtltde.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389434/mainSite/art/65w_o3jw7l.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389432/mainSite/art/64w_gzzbcw.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389433/mainSite/art/63w_e4vecy.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389434/mainSite/art/62w_v19wbk.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389433/mainSite/art/5w_q6pwha.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389434/mainSite/art/55w_i87ax4.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389434/mainSite/art/52w_imvbev.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389434/mainSite/art/4w_smikxg.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389434/mainSite/art/42w_hvw42e.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389433/mainSite/art/3w_l7xjfa.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389434/mainSite/art/37w_p8k3tu.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389434/mainSite/art/36w_zhxxlm.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389434/mainSite/art/32w_dx2o9g.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389434/mainSite/art/30w_ucrvcg.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389433/mainSite/art/2w_mzdxrq.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389434/mainSite/art/29w_ydx66o.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389433/mainSite/art/1w_rh6yie.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389433/mainSite/art/19w_diooe5.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389434/mainSite/art/17w_erc59a.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389432/mainSite/art/16w_ayhvai.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389433/mainSite/art/15w_vdxg7l.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389433/mainSite/art/14w_jxwk3y.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389434/mainSite/art/13w_kslnqa.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389433/mainSite/art/12w_snnu4u.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389433/mainSite/art/11w_lt7xff.webp',
    'http://res.cloudinary.com/dt4xntymn/image/upload/v1635389433/mainSite/art/10w_v8r57x.webp'
]
console.log(JSON.stringify(images))