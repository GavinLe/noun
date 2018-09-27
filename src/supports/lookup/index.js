/**
 * Created by gavin on 18/8/4.
 */

class BaseLookup {
  constructor() {
    this._list = null;
  };

  getList() {
    if (this._lists) {
      return this._lists;
    } else {
      this._lists = this.generateList();
      return this._lists;
    }
  };
  generateList() { return []; }

  getListWithEmpty(emptyOption) {
    let list = this.getList();
    let emptySelection = Object.assign({Code: -1, DisplayName: '请选择'}, emptyOption || {});
    list.splice(0, 0, emptySelection);
    return list;
  }

  getEnums() {
    if (this._enums) {
      return this._enums;
    } else {
      this._enums = {};
      var list = this.getList();
      for (var k in list) {
        var item = list[k];
        this._enums[item.Code] = item;
      }
    }
    return this._enums;
  }

  getByCode(code) {
    if (code || code === 0) {
      return this.getEnums()[code] || null;
    }
    return null;
  }

  getByCodes(codesArray) {
    var results = [];
    for (var k in codesArray) {
      results.push(this.getEnums()[codesArray[k]]);
    }
    return results;
  }

  getByMergedCode(mCode) {
    var rst = [];
    var lists = this.getList();
    lists.forEach((item) => {
      if ((item.Code & mCode) > 0) {
        rst.push(item);
      }
    });
    return rst;
  }

  getByJoinedCode(mCode) {
    var codes = [];
    if (mCode) {
      codes = mCode.split(',');
    }

    var rst = [];
    var lists = this.getList();
    lists.forEach(function(item) {
      if ((codes.indexOf(item.Code)) > -1) {
        rst.push(item);
      }
    });
    return rst;
  }

  getNamesList(codesArray) {
    var enums = this.getEnums();
    var results = [];
    for (var k in codesArray) {
      var code = codesArray[k];
      if (enums[code]) {
        results.push(enums[code].DisplayName);
      }
    }
    return results;
  };

  getNameByMergedCode (mCode) {
    var rst = [];
    var lists = this.getList();
    lists.forEach(function(item) {
      if ((item.Code & mCode) > 0) {
        rst.push(item.DisplayName);
      }
    });
    return rst.join(', ');
  }

  getShortNameByMergedCode(mCode) {
    var rst = [];
    var list = this.getList();
    list.forEach(function(item) {
      if ((item.Code & mCode) > 0) {
        rst.push(item.ShortName);
      }
    });
    return rst.join(', ');
  }

  getArrayByMergedCode(mCode) {
    var rst = [];
    var lists = this.getList();
    lists.forEach(function(item) {
      if ((item.Code & mCode) > 0) {
        rst.push(item);
      }
    });
    return rst;
  }

  getNameByJoinedCode(mCode) {
    var codes = [];
    if (mCode) {
      codes = mCode.split(',');
    }

    var rst = [];
    var lists = this.getList();
    lists.forEach(function(item) {
      if ((codes.indexOf(item.Code)) > -1) {
        rst.push(item.DisplayName);
      }
    });

    return rst.join(', ');
  }

  getUISelectionList(inList) {
    var newList = [];

    var list = inList || this.getList();
    for (var i in list) {
      var item = list[i];
      newList.push({
        name: item.DisplayName,
        value: item.Code,
        item: item,
        selected: false
      });
    }

    return newList;
  }

  toCheckSource(lists) {
    return new CheckHelper(lists || this.getList());
  }
}

class CheckHelper extends BaseLookup {
  constructor(lists, initValue) {
    super();
    this._lists = lists;
    if (initValue) {
      this.setSelected(initValue);
    }
  }

  setSelected(v) {
    this._lists.forEach(function(item) {
      if ((item.Code & v) == item.Code) {
        item.selected = true;
      }
    });
  }

  setUNSelect(v) {
    this._lists.forEach(function(item) {
      if ((item.Code & v) > 0) {
        item.selected = false;
      }
    });
  }

  getSelectedNames(v) {
    var rst = [];
    var list = this.getSelectedLists(v);
    list.forEach(function(item) {
      rst.push(item.DisplayName);
    });
    return rst;
  }

  getSelectedLists(v) {
    var rst = [];
    this._lists.forEach(function(item) {
      if (!v && v != 0) {
        if (item.selected) {
          rst.push(item);
        }
      } else {
        if ((item.Code & v) > 0) {
          rst.push(item);
        }
      }
    });
    return rst;
  }

  getSelectedValue() {
    var v = 0;
    this._lists.forEach(function(item) {
      if (item.selected) {
        v = v | item.Code;
      }
    });
    return v;
  }
}

class StatusType extends BaseLookup {
  generateList() {
    return [
      {Code: 10, DisplayName: '草稿'},
      {Code: 20, DisplayName: '待确认'},
      {Code: 30, DisplayName: '已确认'},
      {Code: 40, DisplayName: '生效'}
    ];
  }
}

var lookups = {
  StatusType: new StatusType()
};

export default lookups;
