import collect from 'bisheng/collect';
import Layout from './Layout';
import * as utils from '../utils';

export default collect(async (nextProps) => {
  const pathname = nextProps.location.pathname;

  const path = pathname.replace('-cn', '');

  const pageDataPath = path.split('/');

  if (path === 'index' || path === '/') {
    // exhibition.demo, queue-anim.simple.demo
    const componentsPageData = nextProps.utils.get(nextProps.data, ['components'])['queue-anim'].demo();
    return {
      localizedPageData: {
        'queue-anim': await componentsPageData,
      },
    };
  }
  let pageData = nextProps.utils.get(nextProps.data, pageDataPath);
  pageData = pageDataPath[0] === 'exhibition' && !pageDataPath[1] ? pageData.demo : pageData;

  if (pathname === 'components') {
    location.href = '/components/tween-one';
    return;
  }

  if (!pageData) {
    throw 404; // eslint-disable-line no-throw-literal
  }
  const locale = utils.isZhCN(pathname) ? 'zh-CN' : 'en-US';
  const pageDataPromise = typeof pageData === 'function'
    ? pageData() : (pageData[locale] || pageData.index[locale] || pageData.index)();
  const demosFetcher = nextProps.utils.get(nextProps.data, [...pageDataPath, 'demo']);
  if (demosFetcher) {
    const [localizedPageData, demos] = await Promise.all([pageDataPromise, demosFetcher()]);
    return { localizedPageData, demos };
  }
  return { localizedPageData: await pageDataPromise };
})(Layout);
