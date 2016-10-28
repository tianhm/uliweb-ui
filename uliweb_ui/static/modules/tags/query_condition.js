
riot.tag2('query-condition', '<div class="query-condition"> <form method="get" action="{opts.url}"> <div each="{row, i in layout}" show="{i==0 || show}" class="{condition-row:true, condition-row-more:i>0}"> <div each="{field in row}" class="condition-cell"> <span class="condition-label {nomore:i==0 &&!show}" riot-style="min-width:{!show?0:labelWidth}px">{fields[this.field].label || field}</span> <input-field field="{fields[field]}" data="{data}" type="{fields[this.field].type || \'str\'}" riot-style="min-width:{field.width || inputWidth}px"> </input-field> </div> <div if="{i==0 && !show}" class="condition-cell condition-buttons"> <button class="btn btn-primary btn-flat" type="submit"><i class="fa fa-search"></i> {searchTitle}</button> <button class="btn btn-link btn-flat" type="button" onclick="{parent.reset}">{clearTitle}</button> </div> </div> <div class="condition-row condition-row-more condition-buttons" show="{show}"> <button class="btn btn-primary btn-flat" type="submit"><i class="fa fa-search"></i> {searchTitle}</button> <button class="btn btn-link btn-flat" type="button" onclick="{reset}">{clearTitle}</button> </div> <div if="{layout.length > 1}" class="{condition-more:true, visible:layout.length>1, hover:hover}"> <span href="#" onclick="{click}" onmouseenter="{mouseenter}" onmouseleave="{mouseleave}"> {show? moreTitle[0] : moreTitle[1]} <i class="{fa:true, fa-angle-up:show, fa-angle-down:!show}"></i> </span> </div> </form> </div>', 'query-condition .query-condition,[riot-tag="query-condition"] .query-condition,[data-is="query-condition"] .query-condition{ margin-bottom:5px; background-color: white; padding: 5px; } query-condition .condition-row,[riot-tag="query-condition"] .condition-row,[data-is="query-condition"] .condition-row{ margin-top: 5px; margin-bottom: 5px; padding-top: 5px; } query-condition .condition-row-more,[riot-tag="query-condition"] .condition-row-more,[data-is="query-condition"] .condition-row-more{ border-top: 1px solid #ddd; } query-condition .condition-row:last-child,[riot-tag="query-condition"] .condition-row:last-child,[data-is="query-condition"] .condition-row:last-child{ border-bottom: none; } query-condition .condition-label,[riot-tag="query-condition"] .condition-label,[data-is="query-condition"] .condition-label{ margin-left:8px; margin-right:8px; display: inline-block; text-align: right; } query-condition .condition-label.nomore,[riot-tag="query-condition"] .condition-label.nomore,[data-is="query-condition"] .condition-label.nomore{ min-width: 0px; } query-condition .condition-cell,[riot-tag="query-condition"] .condition-cell,[data-is="query-condition"] .condition-cell{ display: inline-block; } query-condition .condition-more,[riot-tag="query-condition"] .condition-more,[data-is="query-condition"] .condition-more{ text-align: center; margin-top: 5px; margin-bottom: 10px; position: relative; height: 18px; line-height: 18px; } query-condition .condition-more.visible,[riot-tag="query-condition"] .condition-more.visible,[data-is="query-condition"] .condition-more.visible{ border-top:1px solid #ddd; } query-condition .condition-more.visible.hover,[riot-tag="query-condition"] .condition-more.visible.hover,[data-is="query-condition"] .condition-more.visible.hover{ border-top:1px solid red; } query-condition .condition-more span,[riot-tag="query-condition"] .condition-more span,[data-is="query-condition"] .condition-more span{ position: absolute; left:0; right:0; top:-1px; width:100px; border: 1px solid #ddd; border-top: 1px solid white; margin: 0 auto; cursor: pointer; font-size: 80%; background-color: white; line-height: 22px; height:22px; } query-condition .condition-more span:hover,[riot-tag="query-condition"] .condition-more span:hover,[data-is="query-condition"] .condition-more span:hover{ border: 1px solid red; border-top: 1px solid white; } query-condition .form-control,[riot-tag="query-condition"] .form-control,[data-is="query-condition"] .form-control{ display:inline-block; vertical-align: middle; } query-condition input-field,[riot-tag="query-condition"] input-field,[data-is="query-condition"] input-field{ display:inline-block; } query-condition .condition-row.condition-row-more.condition-buttons,[riot-tag="query-condition"] .condition-row.condition-row-more.condition-buttons,[data-is="query-condition"] .condition-row.condition-row-more.condition-buttons{ text-align: center; margin-right: 5px; } query-condition .condition-row.condition-row-more.condition-buttons button,[riot-tag="query-condition"] .condition-row.condition-row-more.condition-buttons button,[data-is="query-condition"] .condition-row.condition-row-more.condition-buttons button{ margin-right: 5px; } query-condition .multiselect-container li input[type="radio"],[riot-tag="query-condition"] .multiselect-container li input[type="radio"],[data-is="query-condition"] .multiselect-container li input[type="radio"]{margin-left:-200px;}', '', function(opts) {
      var self = this
      this.layout = opts.layout
      this.fields = {}
      this.labelWidth = opts.labelWidth || 100
      this.inputWidth = opts.inputWidth || 200
      this.searchTitle = opts.searchTitle || '查询'
      this.clearTitle = opts.clearTitle || '清除条件'
      this.moreTitle = opts.moreTitle || ['收起', '更多条件']
      this.ajax = opts.ajax
      this.url = opts.url

      opts.fields.forEach(function(v){
        self.fields[v['name']] = v
        if (v.type == 'select')
          v.placeholder = v.placeholder || '--- 请选择 ---'
        v._width = v.width ? v.width+'px' : (v.range?'auto':'100%')
      })
      this.show = false
      self.hover = false

      var query = new QueryString(this.url)
      this.data = $.extend({}, query.urlParams, opts.data)

      if (!this.layout) {
          this.layout = []
          var s = []
          this.layout.push(s)
          for (k in this.fields) {
              s.push(k);
          }
      }

      this.click = function(e){
        self.show = !self.show
      }

      this.mouseenter = function(e) {
        self.hover = true
      }

      this.mouseleave = function(e) {
        self.hover = false
      }

      this.reset = function(e){
        for (k in self.fields) {
          var field = self.fields[k]
          if (field.type == 'select' && field['data-url']) {
            $('[name='+k+']', self.root).val('').trigger('change')
          }
          else if (field.type == 'select') {

            $('[name='+k+']', self.root)
              .multiselect('deselectAll', false)
              .multiselect('updateButtonText')
          } else
            $('[name='+k+']', self.root).val(null)
        }
      }

      this.on('mount', function(){
        if (self.ajax) {
          $(':submit', self.root).click(function (e) {
            e.preventDefault()
            var d = serializeObject(self.root)
            var url = get_url(self.url, d)

            self.parent.page = 1
            self.parent.load(url)
          })
        }
      })

});

riot.tag2('input-field', '<input type="text" name="{opts.field.name}" class="form-control" field-type="str" if="{opts.type==\'str\' || opts.type==\'unicode\' || opts.type==\'int\'}" placeholder="{get_placeholder(opts.field.placeholder, 0)}" riot-style="width:{opts.field._width}"> <input type="password" name="{opts.field.name}" class="form-control" field-type="password" if="{opts.type==\'password\'}" placeholder="{opts.field.placeholder}" riot-style="width:{opts.field._width}"> <select __multiple="{opts.field.multiple}" if="{opts.type==\'select\'}" field-type="select" riot-style="width:{opts.field._width}" name="{opts.field.name}" data-url="{opts.field[\'data-url\']}" placeholder="{opts.field.placeholder}"> <option if="{opts.field.placeholder && !opts.field.multiple}" value="">{opts.field.placeholder}</option> <option each="{value in opts.field.choices}" value="{value[0]}"> {value[1]} </option> </select> <input type="text" name="{opts.field.name}" class="form-control" field-type="{opts.type}" if="{(opts.type==\'date\' || opts.type==\'datetime\')}" placeholder="{get_placeholder(opts.field.placeholder, 0)}" riot-style="width:{opts.field._width}"> {⁗-⁗: opts.field.range} <input type="text" name="{opts.field.name}" class="form-control" field-type="{opts.type}" if="{(opts.type==\'date\' || opts.type==\'datetime\' || opts.type==\'str\' || opts.type==\'unicode\' || opts.type==\'int\') && opts.field.range==true}" placeholder="{get_placeholder(opts.field.placeholder, 1)}" riot-style="width:{opts.field._width}">', '', '', function(opts) {
    var self = this

    this.on('mount', function(){
      var i18n = {
        previousMonth : '上个月',
        nextMonth   : '下个月',
        months      : ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
        weekdays    : ['周日','周一','周二','周三','周四','周五','周六'],
        weekdaysShort : ['日','一','二','三','四','五','六']
      }

      if (opts.type == 'select' && opts.field['data-url']){
        load('ui.select2', function(){
          var el = $('[name='+opts.field.name+']', self.root);
          simple_select2(el, {width:'resolve'})
        })
      }else if (opts.type == 'select') {
        var _opts = $.extend({}, {
            includeSelectAllOption: true,
            selectAllText: '全选',
            allSelectedText: '全部选中',
            nSelectedText: '个已选',

            buttonClass: 'btn btn-default btn-flat',
            numberDisplayed: 2,
            selectedClass: '',
            nonSelectedText: opts.field.placeholder || '请选择',
            maxHeight: 200
            }, opts.field.opts || {})

        if (opts.field.relate_from) {
          if (!opts.field.choices_url) {

            var trigger_name = opts.field.relate_from;
            var trigger = $($('[name="' + trigger_name + '"]')[0]);
            var actor = $($('[name="' + opts.field.name + '"]')[0]);
            var relation_kv = opts.field.relationship;
            var actor_full_choices = opts.field.choices;

            $('body').on('change', '[name="' + trigger_name + '"]', function(){
              var trigger_selected = trigger.val();
              var allow_options = [];
              $.each(trigger_selected || [], function(){
                if (isNaN(parseInt(this))) {
                  Array.prototype.push.apply(allow_options, relation_kv[this]);
                } else {
                  Array.prototype.push.apply(allow_options, relation_kv[parseInt(this)]);
                }
              });

              opts.field.choices = [];
              $.each(actor_full_choices, function() {
                if (allow_options.indexOf(""+this[0]) > -1) {
                  opts.field.choices.push(this);
                }
              });

              self.update();
              if ($.fn.multiselect) {
                actor.multiselect('rebuild');
              }
            });
            trigger.trigger("change");
          } else {
            var trigger_name_list = [];
            var actor = $($('[name="' + opts.field.name + '"]')[0]);
            if (typeof(opts.field.relate_from) == 'string'){
              trigger_name_list.push(opts.field.relate_from);
            } else if (typeof(opts.field.relate_from) == 'object'){
              trigger_name_list = opts.field.relate_from;
            }
            var len = trigger_name_list.length;
            for (var t = 0; t < len; t++){
              $('body').on('change', '[name="' + trigger_name_list[t] + '"]', function(){
                var trigger_selected_list = [];
                for (var tt = 0; tt < len; tt++){
                  var trigger_selected = $('[name=' + trigger_name_list[tt] + ']').val();
                  if (!!trigger_selected && typeof(trigger_selected) == 'object') {
                    if (trigger_selected.length >= 2) {
                      trigger_selected = trigger_selected.join(',');
                    } else if (trigger_selected.length == 1) {
                      trigger_selected = trigger_selected[0];
                    } else {
                      trigger_selected = "-1";
                    }
                  } else {
                    if (trigger_selected === undefined || trigger_selected === null || !("" + trigger_selected)){
                      trigger_selected = "-1";
                    }
                  }

                  trigger_selected_list.push(trigger_selected);
                }

                var trigger_selected_url_string = trigger_selected_list.join('/');
                $.ajax({
                  method: "post",
                  url: opts.field.choices_url + '/' + trigger_selected_url_string,
                  async: false,
                  success: function(result) {
                    opts.field.choices = result;
                    self.update();
                    if ($.fn.multiselect) {
                      actor.multiselect('rebuild');
                    }
                  }
                });
              });
            }

            $.each(trigger_name_list, function(){
              $('[name=' + this + ']').trigger('change');
            });
          }
        }

        load('ui.bootstrap.multiselect', function(){
          var el = $('[name='+opts.field.name+']', self.root).multiselect(_opts);
          if (opts.data[opts.field.name]){
            el.multiselect('select', opts.data[opts.field.name]);
          }
        })
      } else if (opts.type == 'date') {
        var _opts = {format: 'YYYY-MM-DD', showTime:false, i18n:i18n};
        load('ui.pikaday', function(){
          $('[name='+opts.field.name+']').pikaday(_opts);
        })
      } else if (opts.type == 'datetime') {
        var _opts = {format: 'YYYY-MM-DD HH:mm:ss', showTime:true, use24hour:true, i18n:i18n}
        load('ui.pikaday', function(){
          $('[name='+opts.field.name+']').pikaday(_opts);
        })
      } else {
      }
      if (opts.data[opts.field.name])
        if (opts.type == "select" || typeof(opts.data[opts.field.name]) == "string") {
          $('[name='+opts.field.name+']').val(opts.data[opts.field.name]);
        } else {
          $($('[name='+opts.field.name+']')[0]).val(opts.data[opts.field.name][0]);
          $($('[name='+opts.field.name+']')[1]).val(opts.data[opts.field.name][1]);
        }
    })

    this.get_placeholder = function (placeholder, index) {
      index = index === undefined ? 0 : index
      return Array.isArray(placeholder) ? placeholder[index]: placeholder
    }
});
