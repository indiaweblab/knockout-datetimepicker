ko.bindingHandlers['datetimepickerValue'] = {
  'init': function (element, valueAccessor, allBindings) {

    var writeValueToProperty = function (property, allBindings, key, value, checkIfDifferent) {
      if (!property || !ko.isObservable(property)) {
        var propWriters = allBindings.get('_ko_property_writers');
        if (propWriters && propWriters[key])
          propWriters[key](value);
      } else if (ko.isWriteableObservable(property) && (!checkIfDifferent || property.peek() !== value)) {
        property(value);
      }
    };

    var valueUpdateHandler = function (event) {
      var modelValue = valueAccessor();
      writeValueToProperty(modelValue, allBindings, 'datetimepickerValue', event.date);
    };

    var updateFromModel = function() {
      var newValue = ko.utils.unwrapObservable(valueAccessor());
      // If the date is coming from a Microsoft webservice.
      if (typeof newValue === "string" && newValue.indexOf('/Date(') === 0) {
        newValue = new Date(parseInt(newValue.replace(/\/Date\((.*?)\)\//gi, "$1")));
      }
      var picker = $(element).data('DateTimePicker');
      var elementValue = picker.date;

      if (newValue == null || newValue == undefined) {
        picker.date(newValue);
      } else if (newValue - elementValue !== 0) {
        picker.date(newValue);
      }
    };

    var options = allBindings().datetimepickerOptions || {};
    $(element).datetimepicker(options).on('dp.change', valueUpdateHandler);

    ko.computed(updateFromModel, null, { disposeWhenNodeIsRemoved: element });
  },
  'update': function() {} // Keep for backwards compatibility with code that may have wrapped value binding
}

ko.expressionRewriting._twoWayBindings['datetimepickerValue'] = true;
