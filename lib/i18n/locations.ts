import type { Lang } from './dictionary';

// Chinese names for cities used in seed data.
const CITY_ZH: Record<string, string> = {
  Shanghai: '上海',
  Shenzhen: '深圳',
  Nanjing: '南京',
  Chengdu: '成都',
  Beijing: '北京',
  Hangzhou: '杭州',
  Guangzhou: '广州',
  Suzhou: '苏州',
  Wuhan: '武汉',
  Tianjin: '天津',
  Xian: '西安',
  Qingdao: '青岛',
  Chongqing: '重庆',
  Changsha: '长沙',
  Zhengzhou: '郑州',
  Dalian: '大连',
  Xiamen: '厦门',
  Kunming: '昆明',
  Hefei: '合肥',
  Fuzhou: '福州',
};

// Chinese names for districts, keyed as "City.District" to avoid collisions.
const DISTRICT_ZH: Record<string, string> = {
  // Shanghai
  'Shanghai.Pudond': '浦东',
  'Shanghai.Pudong': '浦东',
  'Shanghai.Huangpu': '黄浦',
  'Shanghai.Xuhui': '徐汇',
  'Shanghai.Jingan': '静安',
  'Shanghai.Putuo': '普陀',
  'Shanghai.Hongkou': '虹口',
  'Shanghai.Yangpu': '杨浦',
  'Shanghai.Minhang': '闵行',
  'Shanghai.Baoshan': '宝山',
  'Shanghai.Jiading': '嘉定',
  'Shanghai.Songjiang': '松江',
  'Shanghai.Qingpu': '青浦',
  'Shanghai.Fengxian': '奉贤',
  'Shanghai.Jinshan': '金山',
  'Shanghai.Chongming': '崇明',

  // Shenzhen
  'Shenzhen.Nanshan': '南山',
  'Shenzhen.Futian': '福田',
  'Shenzhen.Luohu': '罗湖',
  'Shenzhen.Baoan': '宝安',
  'Shenzhen.Longgang': '龙岗',
  'Shenzhen.Yantian': '盐田',
  'Shenzhen.Longhua': '龙华',
  'Shenzhen.Pingshan': '坪山',
  'Shenzhen.Guangming': '光明',

  // Nanjing
  'Nanjing.Xuanwu': '玄武',
  'Nanjing.Gulou': '鼓楼',
  'Nanjing.Jianye': '建邺',
  'Nanjing.Qinhuai': '秦淮',
  'Nanjing.Qixia': '栖霞',
  'Nanjing.Yuhuatai': '雨花台',
  'Nanjing.Jiangning': '江宁',
  'Nanjing.Liuhe': '六合',
  'Nanjing.Lishui': '溧水',
  'Nanjing.Gaochun': '高淳',

  // Chengdu
  'Chengdu.Jinjiang': '锦江',
  'Chengdu.Wuhou': '武侯',
  'Chengdu.Qingyang': '青羊',
  'Chengdu.Jinniu': '金牛',
  'Chengdu.Chenghua': '成华',
  'Chengdu.Longquanyi': '龙泉驿',
  'Chengdu.Qingbaijiang': '青白江',
  'Chengdu.Xindu': '新都',
  'Chengdu.Wenjiang': '温江',
  'Chengdu.Shuangliu': '双流',
  'Chengdu.Pidu': '郫都',
  'Chengdu.Xinjin': '新津',
  'Chengdu.Jintang': '金堂',
  'Chengdu.Dayi': '大邑',
  'Chengdu.Pujiang': '蒲江',

  // Guangzhou
  'Guangzhou.Tianhe': '天河',
  'Guangzhou.Yuexiu': '越秀',
  'Guangzhou.Haizhu': '海珠',
  'Guangzhou.Liwan': '荔湾',
  'Guangzhou.Baiyun': '白云',
  'Guangzhou.Huangpu': '黄埔',
  'Guangzhou.Panyu': '番禺',
  'Guangzhou.Huadu': '花都',
  'Guangzhou.Nansha': '南沙',
  'Guangzhou.Conghua': '从化',
  'Guangzhou.Zengcheng': '增城',

  // Hangzhou
  'Hangzhou.Shangcheng': '上城',
  'Hangzhou.Xiacheng': '下城',
  'Hangzhou.Gongshu': '拱墅',
  'Hangzhou.Xihu': '西湖',
  'Hangzhou.Binjiang': '滨江',
  'Hangzhou.Xiaoshan': '萧山',
  'Hangzhou.Yuhang': '余杭',
  'Hangzhou.Fuyang': '富阳',
  'Hangzhou.Linan': '临安',
  'Hangzhou.Tonglu': '桐庐',
  'Hangzhou.Chunan': '淳安',
};

export function formatLocation(city: string, district: string, lang: Lang): string {
  if (lang === 'zh') {
    const c = CITY_ZH[city] ?? city;
    const d = DISTRICT_ZH[`${city}.${district}`] ?? district;
    return `${c}·${d}`;
  }
  return `${city} ${district}`;
}
