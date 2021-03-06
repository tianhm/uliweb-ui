<rgrid>

  <style scoped>
    .rgrid-tools {margin-bottom:5px;padding-left:5px;}
    .btn-toolbar .btn-group {margin-right:8px;}
  </style>

  <!-- 条件 -->
  <query-condition if={has_query} rules={query_rules} url={query_url} ajax={query_ajax}
    fields={query_fields} layout={query_layout} data={query_data} field_options={query_field_options}></query-condition>
  <!-- 按钮生成 -->
  <div if={left_tools.length>0 || right_tools.length>0} class="btn-toolbar">
    <div if={left_tools.length>0} class="rgrid-tools pull-left">
      <div each={btn_group in left_tools} class={btn_group_class}>
        <button each={btn in btn_group} data-is="rgrid-button" btn={btn}></button>
      </div>
    </div>
    <div if={right_tools.length>0} class="rgrid-tools pull-right">
      <div each={btn_group in right_tools} class={btn_group_class}>
        <button each={btn in btn_group} data-is="rgrid-button" btn={btn}></button>
      </div>
    </div>
  </div>
  <yield/>
  <!-- 表格 -->
  <rtable cols={cols} options={rtable_options} data={data} start={start} observable={observable}></rtable>
  <!-- footer 按钮 -->
  <div class="clearfix tools">
    <pagination if={pagination} data={data} url={url} page={page} total={total} observable={observable}
      limit={limit} onpagechanged={onpagechanged} onbeforepage={onbeforepage} onlimit={onlimit}
      buttons={footer_tools} theme={page_theme}></pagination>
    <div if={!pagination && footer_tools.length>0} class="pull-right {btn_group_class}">
      <button each={btn in footer_tools} data-is="rgrid-button" btn={btn}></button>
    </div>
  </div>

  /*
   * opts = {cols:,
     url:
     query:

     pagination:true,
     tableClass:, nameField:, labelField:, page:, total: limit:}
   */
  var self = this

  if (opts.data) {
    if (Array.isArray(opts.data)) {
      this.data = new DataSet(opts.data)
    } else
      this.data = opts.data
  } else
    this.data = new DataSet()
  this.cols = opts.cols
  this.url = opts.url
  //解析url中的page参数
  var query = new QueryString(this.url)
  this.observable = opts.observable || riot.observable()
  this.page = opts.page || parseInt(query.get('page')) || 1
  this.limit = opts.limit || 10
  this.limits = opts.limits || [10, 20, 30, 40, 50]
  this.total = opts.total || 0
  this.pagination = opts.pagination == undefined ? true : opts.pagination
  this.has_query = opts.query !== undefined
  this.query = opts.query || {}
  this.query_rules = this.query.rules || {}
  this.query_fields = this.query.fields || []
  this.query_layout = this.query.layout || []
  this.query_data = this.query.data || {}
  this.query_url = opts.query_url || this.url
  this.query_field_options = this.query.field_options || {}
  this.query_ajax = opts.query_ajax
  this.start = (this.page - 1) * this.limit
  this.footer_tools = opts.footer_tools || []
  this.left_tools = opts.left_tools || opts.tools || []
  this.right_tools = opts.right_tools || []
  this.btn_group_class = opts.btn_group_class || 'btn-group btn-group-sm'
  this.onLoaded = opts.onLoaded
  this.autoLoad = opts.audoLoad || true
  this.onBeforePage = opts.onBeforePage || function (page){ return true }
  this.page_theme = opts.page_theme || 'simple'

  this.onsort = function (sorts) {
    var _url
    if (sorts.length > 0) {
      _url = get_url(self.url, {sort:sorts[0].name+'.'+sorts[0].direction})
    } else
      _url = get_url(self.url, {sort:''})

    self.url = _url
    self.load(_url, function(r){
      return r.rows
    })
  }

  /* 切换每页条数 */
  this.onlimit = function (limit) {
    self.limit = limit
    self.load()
  }



  this.onloaddata = function (parent) {
    var param = {parent:parent[opts.idField || 'id']}
    $.getJSON(self.url, param).done(function(r){
      if (r.rows.length > 0) {
        self.data.add(r.rows, parent)
      }
      else {
        parent.has_children = false
        self.update()
      }
    })
  }

  this.onbeforepage = function (page) {
    var r = self.onBeforePage(page)
    if (r) {
      self.start = (page - 1) * self.limit
      self.page = page
      return true
    } else {
      return false
    }
  }

  this.rtable_options = {
    theme : opts.theme || 'zebra',
    combineCols : opts.combineCols,
    nameField : opts.nameField || 'name',
    labelField : opts.labelField || 'title',
    indexCol: opts.indexCol,
    checkCol: opts.checkCol,
    checkColTitle: opts.checkColTitle,
    checkColWidth: opts.checkColWidth,
    indexColFrozen: opts.indexColFrozen,
    checkColFrozen: opts.checkColFrozen,
    showSelected: opts.showSelected,
    checkAll: opts.checkAll,
    multiSelect: opts.multiSelect,
    maxHeight: opts.maxHeight,
    minHeight: opts.minHeight,
    height: opts.height,
    width: opts.width,
    clickSelect: opts.clickSelect,
    rowHeight: opts.rowHeight,
    container: $(this.root).parent(),
    noData: opts.noData,
    tree: opts.tree,
    expanded: opts.expanded === undefined ? true : opts.expanded,
    useFontAwesome: opts.useFontAwesome === undefined ? true : opts.useFontAwesome,
    idField: opts.idField,
    parentField: opts.parentField,
    orderField: opts.orderField,
    levelField: opts.levelField,
    treeField: opts.treeField,
    hasChildrenField: opts.hasChildrenField,
    virtual: opts.virtual,
    contextMenu: opts.contextMenu,
    onDblclick: opts.onDblclick,
    onClick: opts.onClick,
    onMove: opts.onMove,
    onEdit: opts.onEdit,
    onEdited: opts.onEdited,
    onSelect: opts.onSelect,
    onDeselect: opts.onDeselect,
    onSelected: opts.onSelected,
    onDeselected: opts.onDeselected,
    onLoadData: opts.onLoadData || this.onloaddata,
    onSort: opts.onSort || this.onsort,
    onCheckable: opts.onCheckable,
    onRowClass: opts.onRowClass,
    onEditable: opts.onEditable,
    onInitData: opts.onInitData,
    colspanValue: opts.colspanValue,
    draggable: opts.draggable,
    editable: opts.editable,
    remoteSort: opts.remoteSort
  }

  <!-- this.onpagechanged = function (page) {
    self.start = (page - 1) * self.limit
    self.update()
  }
 -->
  this.on('mount', function(){
    this.table = this.root.querySelector('rtable')

    var item, items
    var tools = this.left_tools.concat(this.right_tools).concat([this.footer_tools])
    for(var i=0, len=tools.length; i<len; i++){
        items = tools[i]
        for(var j=0, _len=items.length; j<_len; j++) {
          item = items[j]
          var onclick = function(btn) {
              return function(e) {
                if (btn.onClick)
                  return btn.onClick.call(self, e)
                if (btn.url)
                  window.location.href = btn.url
              }
          }
          item.onclick = onclick(item)

          item.disabled = function(btn) {
              if (btn.onDisabled)
                return btn.onDisabled.call(self)
              if (btn.checkSelected)
                return self.table.get_selected().length == 0
          }
          item.class = 'btn ' + (item.class || 'btn-primary')
        }
    }

    this.root.add = this.table.add
    this.root.addFirstChild = this.table.addFirstChild
    this.root.update = this.table.update
    this.root.remove = this.table.remove
    this.root.get = this.table.get
    this.root._get = this.table._get
    this.root.load = this.load
    this.root.insertBefore = this.table.insertBefore
    this.root.insertAfter = this.table.insertAfter
    this.root.get_selected = this.table.get_selected
    this.root.expand = this.table.expand
    this.root.collapse = this.table.collapse
    this.root.is_selected = this.table.is_selected
    this.root.move = this.table.move
    this.root.save = this.table.save
    this.root.diff = this.table.diff
    this.root.getButton = this.getButton
    this.root.refresh = this.update
    this.root.select = this.table.select
    this.root.deselect = this.table.deselect
    this.root.set_selected = this.table.set_selected
    this.root.resize = this.table.resize
    this.root.instance = this
    if (this.url && this.autoLoad) {
      this.table.show_loading(true)
      setTimeout(function(){self.load(self.url)}, 100)
    }

    this.observable.on('selected', function(row) {
      self.update()
    })

    this.observable.on('deselected', function(row) {
      self.update()
    })

    self.data.on('*', function(r, d){
      if (self.pagination) {
        if (r == 'remove') self.total -= d.items.length
        else if (r == 'add') self.total += d.items.length
      } else
        self.total = self.data.length
    })

  })

  this.load = function(url, param){
    var f, url
    param = param || {}
    var _f = function(r){
      return r.rows
    }

    //如果传了URL才使用URL计算page, limit，否则使用原来的值
    if (url) {
      var query = new QueryString(self.url)
      self.limit = parseInt(query.urlParams['limit']) || self.limit
      self.page = parseInt(query.urlParams['page']) || self.page
    }

    self.url = url || self.url
    if (self.pagination) {
      url = get_url(self.url, {limit:self.limit, page:self.page})
    } else url = self.url
    if (opts.tree) f = self.data.load_tree(url, param, _f)
    else f = self.data.load(url, param, self.onLoaded || _f)
    f.done(function(r){
      self.total = r.total
      self.update()
      self.data.save()
    })
  }

  this.getButton = function(id) {
    return document.getElementById(id)
  }
</rgrid>

<rgrid-button class="{opts.btn.class}" id={opts.btn.id} type="button"
  disabled={opts.btn.disabled ? opts.btn.disabled(btn) : false} onclick={opts.btn.onclick}>
  <i if={opts.btn.icon} class={opts.btn.icon}></i>
  <span>{opts.btn.label}</span>
</rgrid-button>
