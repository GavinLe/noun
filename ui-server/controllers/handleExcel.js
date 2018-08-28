const _ = require('underscore');
const xlsx = require('xlsx');

let handleExcel = {
  generateEffectXlsxData: async function (_headers, _data, _options) {
    let offset = 1;
    // gen banner
    let banner = {};
    _.each(_options.banner, (bValue, rowIdx) => {
      const key = `${handleExcel.getXlsxPosition(0)}${rowIdx + offset}`;
      banner[key] =  {v: bValue};
    });
    offset = _options.banner.length + 1;

    // gen header
    let header = {};
    _.each(_headers, (item, colIdx) => {
      const key = `${handleExcel.getXlsxPosition(colIdx)}${offset}`;
      header[key] =  {v: item.title};
    });
    offset = offset + 1;

    // gen body
    let body = {};
    _.each(_data, (dataItem, rowIdx) => {
      _.each(_headers, (headerItem, colIdx) => {
        const v = dataItem[headerItem.key];
        const key = `${handleExcel.getXlsxPosition(colIdx)}${rowIdx + offset}`;
        // format convert
        let valueObj = {v: v};
        // 处理数据 数子或 字符串
        if (headerItem.formatter == 'money') {
          valueObj['t'] = 'n';
          valueObj['z'] = '#,##0.00';
        }else if (headerItem.formatter == 'num') {
          valueObj['t'] = 'n';
          valueObj['z'] = '#,##0';
        }else if (headerItem.formatter == 'percent') {
          valueObj['t'] = 'n';
          valueObj['z'] = '0.00%';
        }
        body[key] = valueObj;
      });
    });

    // 合并 headers 和 data
    const output = Object.assign({}, banner, header, body);
    // 获取所有单元格的位置
    const outputPos = Object.keys(output);
    // 计算出范围
    const ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];

    // 构建 workbook 对象
    const workbook = {
      SheetNames: ['sheet'],
      Sheets: {
        'sheet': Object.assign({}, output, {'!ref': ref})
      }
    };
    // 导出 Excel
    xlsx.writeFile(workbook, 'tmpoutput.xlsx');
  },
  getXlsxPosition: function (i) {
    let domainChar = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let str = '';
    if (i <= 26) {
      str = domainChar[i];
    } else {
      let loop = Math.floor(i / 26);
      let diff = i - 26;
      str = `${domainChar[loop - 1]}${domainChar[diff - 1]}`;
    }
    return str;
  },
  setXlsxResponseHeader: async function (req, res, fileName) {
    let userAgent = (req.headers['user-agent'] || '').toLowerCase();
    if (userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
      res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(fileName));
    } else if (userAgent.indexOf('firefox') >= 0) {
      let name = '=?UTF-8?B?' + new Buffer(fileName).toString('base64') + '?=';
      res.setHeader('Content-Disposition', 'attachment; filename=' + name);
    } else {
      res.setHeader('Content-Disposition', 'attachment; filename=' + new Buffer(fileName).toString('binary'));
    }
    res.contentType('application/octet-stream; charset=utf-8');
    return res;
  }
};

module.exports = handleExcel;
