import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import _objectWithoutProperties from '@babel/runtime/helpers/esm/objectWithoutProperties';
import { useRef, useCallback, useState, useMemo, useEffect, createElement, useReducer, cloneElement, Fragment, forwardRef, useContext } from 'react';
import { instanceOf, func, string, object, node, oneOfType, number, oneOf } from 'prop-types';
import { u as useUtils, a as useNow, c as DAY_SIZE, D as DAY_MARGIN, b as useDefaultProps, w as withDefaultProps, d as DIALOG_WIDTH, V as VIEW_HEIGHT } from './dimensions-f39eca69.js';
import _extends from '@babel/runtime/helpers/esm/extends';
import clsx from 'clsx';
import Typography from '@material-ui/core/Typography';
import { makeStyles, fade, useTheme, styled } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import { useForkRef, createSvgIcon } from '@material-ui/core/utils';
import { c as CalendarIcon, A as ArrowSwitcher, C as ClockView } from './ClockView-68b1ba14.js';
import _slicedToArray from '@babel/runtime/helpers/esm/slicedToArray';
import { a as arrayIncludes, c as createDelegatedEventHandler, o as onSpaceOrEnter, u as useCanAutoFocus } from './useCanAutoFocus-1eacc580.js';
import { W as WrapperVariantContext, I as IsStaticVariantContext } from './Clock-c2c3c22b.js';
import InputAdornment from '@material-ui/core/InputAdornment';
import { useRifm } from 'rifm';
import { u as useGlobalKeyDown, k as keycode, a as useIsomorphicEffect } from './useKeyDown-5aaf69f9.js';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Calendar } from './Calendar.js';
import Fade from '@material-ui/core/Fade';

var findClosestEnabledDate = function findClosestEnabledDate(_ref) {
  var date = _ref.date,
      utils = _ref.utils,
      minDate = _ref.minDate,
      maxDate = _ref.maxDate,
      disableFuture = _ref.disableFuture,
      disablePast = _ref.disablePast,
      shouldDisableDate = _ref.shouldDisableDate;
  var today = utils.startOfDay(utils.date());

  if (disablePast && utils.isBefore(minDate, today)) {
    minDate = today;
  }

  if (disableFuture && utils.isAfter(maxDate, today)) {
    maxDate = today;
  }

  var forward = date;
  var backward = date;

  if (utils.isBefore(date, minDate)) {
    forward = utils.date(minDate);
    backward = null;
  }

  if (utils.isAfter(date, maxDate)) {
    if (backward) {
      backward = utils.date(maxDate);
    }

    forward = null;
  }

  while (forward || backward) {
    if (forward && utils.isAfter(forward, maxDate)) {
      forward = null;
    }

    if (backward && utils.isBefore(backward, minDate)) {
      backward = null;
    }

    if (forward) {
      if (!shouldDisableDate(forward)) {
        return forward;
      }

      forward = utils.addDays(forward, 1);
    }

    if (backward) {
      if (!shouldDisableDate(backward)) {
        return backward;
      }

      backward = utils.addDays(backward, -1);
    }
  } // fallback to today if no enabled days


  return utils.date();
};
var isYearOnlyView = function isYearOnlyView(views) {
  return views.length === 1 && views[0] === 'year';
};
var isYearAndMonthViews = function isYearAndMonthViews(views) {
  return views.length === 2 && arrayIncludes(views, 'month') && arrayIncludes(views, 'year');
};
var getFormatAndMaskByViews = function getFormatAndMaskByViews(views, utils) {
  if (isYearOnlyView(views)) {
    return {
      mask: '____',
      inputFormat: utils.formats.year
    };
  }

  if (isYearAndMonthViews(views)) {
    return {
      disableMaskedInput: true,
      inputFormat: utils.formats.monthAndYear
    };
  }

  return {
    mask: '__/__/____',
    inputFormat: utils.formats.keyboardDate
  };
};
function parsePickerInputValue(utils, _ref2) {
  var value = _ref2.value;
  var parsedValue = utils.date(value);
  return utils.isValid(parsedValue) ? parsedValue : null;
}
function parseRangeInputValue(utils, _ref3) {
  var _ref3$value = _ref3.value,
      value = _ref3$value === void 0 ? [null, null] : _ref3$value;
  return value.map(function (date) {
    return !utils.isValid(date) || date === null ? null : utils.startOfDay(utils.date(date));
  });
}
var isRangeValid = function isRangeValid(utils, range) {
  return Boolean(range && range[0] && range[1] && utils.isBefore(range[0], range[1]));
};
var isWithinRange = function isWithinRange(utils, day, range) {
  return isRangeValid(utils, range) && utils.isWithinRange(day, range);
};
var isStartOfRange = function isStartOfRange(utils, day, range) {
  return isRangeValid(utils, range) && utils.isSameDay(day, range[0]);
};
var isEndOfRange = function isEndOfRange(utils, day, range) {
  return isRangeValid(utils, range) && utils.isSameDay(day, range[1]);
};
var validateDate = function validateDate(utils, value, _ref4) {
  var minDate = _ref4.minDate,
      maxDate = _ref4.maxDate,
      disableFuture = _ref4.disableFuture,
      shouldDisableDate = _ref4.shouldDisableDate,
      disablePast = _ref4.disablePast;
  var now = utils.date();
  var date = utils.date(value);

  if (value === null) {
    return null;
  }

  switch (true) {
    case !utils.isValid(value):
      return 'invalidDate';

    case Boolean(shouldDisableDate && shouldDisableDate(date)):
      return 'shouldDisableDate';

    case Boolean(disableFuture && utils.isAfterDay(date, now)):
      return 'disableFuture';

    case Boolean(disablePast && utils.isBeforeDay(date, now)):
      return 'disablePast';

    case Boolean(minDate && utils.isBeforeDay(date, minDate)):
      return 'minDate';

    case Boolean(maxDate && utils.isAfterDay(date, maxDate)):
      return 'maxDate';

    default:
      return null;
  }
};
var validateDateRange = function validateDateRange(utils, value, dateValidationProps) {
  var _value = _slicedToArray(value, 2),
      start = _value[0],
      end = _value[1]; // for partial input


  if (start === null || end === null) {
    return [null, null];
  }

  var dateValidations = [validateDate(utils, start, dateValidationProps), validateDate(utils, end, dateValidationProps)];

  if (dateValidations[0] || dateValidations[1]) {
    return dateValidations;
  }

  if (!isRangeValid(utils, [utils.date(start), utils.date(end)])) {
    return ['invalidRange', 'invalidRange'];
  }

  return [null, null];
};

function getTextFieldAriaText(rawValue, utils) {
  return rawValue && utils.isValid(utils.date(rawValue)) ? "Choose date, selected date is ".concat(utils.format(utils.date(rawValue), 'fullDate')) : 'Choose date';
}
var getDisplayDate = function getDisplayDate(utils, value, inputFormat) {
  var date = utils.date(value);
  var isEmpty = value === null;

  if (isEmpty) {
    return '';
  }

  return utils.isValid(date) ? utils.formatByString(date, inputFormat) : '';
};
function pick12hOr24hFormat(userFormat, ampm, formats) {
  if (userFormat) {
    return userFormat;
  }

  if (typeof ampm === 'undefined') {
    return formats.localized;
  }

  return ampm ? formats['12h'] : formats['24h'];
}
var MASK_USER_INPUT_SYMBOL = '_';
var staticDateWith2DigitTokens = new Date('2019-11-21T22:30:00.000');
var staticDateWith1DigitTokens = new Date('2019-01-01T09:00:00.000');
function checkMaskIsValidForCurrentFormat(mask, format, acceptRegex, utils) {
  var formattedDateWith1Digit = utils.formatByString(utils.date(staticDateWith1DigitTokens), format);
  var inferredFormatPatternWith1Digits = formattedDateWith1Digit.replace(acceptRegex, MASK_USER_INPUT_SYMBOL);
  var inferredFormatPatternWith2Digits = utils.formatByString(utils.date(staticDateWith2DigitTokens), format).replace(acceptRegex, '_');
  var isMaskValid = inferredFormatPatternWith2Digits === mask && inferredFormatPatternWith1Digits === mask; // @ts-ignore Ignore this warning for luxon because it is appearing mostly always (related to the formats structure of luxon itself)

  if (!isMaskValid && utils.lib !== 'luxon' && process.env.NODE_ENV !== 'production') {
    console.warn("The mask \"".concat(mask, "\" you passed is not valid for the format used ").concat(format, ". Falling down to uncontrolled not-masked input."));
  }

  return isMaskValid;
}
var maskedDateFormatter = function maskedDateFormatter(mask, acceptRegexp) {
  return function (value) {
    return value.split('').map(function (_char, i) {
      acceptRegexp.lastIndex = 0;

      if (i > mask.length - 1) {
        return '';
      }

      var maskChar = mask[i];
      var nextMaskChar = mask[i + 1];
      var acceptedChar = acceptRegexp.test(_char) ? _char : '';
      var formattedChar = maskChar === MASK_USER_INPUT_SYMBOL ? acceptedChar : maskChar + acceptedChar;

      if (i === value.length - 1 && nextMaskChar && nextMaskChar !== MASK_USER_INPUT_SYMBOL) {
        // when cursor at the end of mask part (e.g. month) prerender next symbol "21" -> "21/"
        return formattedChar ? formattedChar + nextMaskChar : '';
      }

      return formattedChar;
    }).join('');
  };
};

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function useMaskedInput(_ref) {
  var _ref$acceptRegex = _ref.acceptRegex,
      acceptRegex = _ref$acceptRegex === void 0 ? /[\d]/gi : _ref$acceptRegex,
      disabled = _ref.disabled,
      disableMaskedInput = _ref.disableMaskedInput,
      ignoreInvalidInputs = _ref.ignoreInvalidInputs,
      inputFormat = _ref.inputFormat,
      inputProps = _ref.inputProps,
      label = _ref.label,
      mask = _ref.mask,
      onChange = _ref.onChange,
      rawValue = _ref.rawValue,
      readOnly = _ref.readOnly,
      rifmFormatter = _ref.rifmFormatter,
      TextFieldProps = _ref.TextFieldProps,
      validationError = _ref.validationError;
  var utils = useUtils();
  var isFocusedRef = useRef(false);
  var getInputValue = useCallback(function () {
    return getDisplayDate(utils, rawValue, inputFormat);
  }, [inputFormat, rawValue, utils]);
  var formatHelperText = utils.getFormatHelperText(inputFormat);

  var _React$useState = useState(getInputValue()),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      innerInputValue = _React$useState2[0],
      setInnerInputValue = _React$useState2[1];

  var shouldUseMaskedInput = useMemo(function () {
    // formatting of dates is a quite slow thing, so do not make useless .format calls
    if (!mask || disableMaskedInput) {
      return false;
    }

    return checkMaskIsValidForCurrentFormat(mask, inputFormat, acceptRegex, utils);
  }, [acceptRegex, disableMaskedInput, inputFormat, mask, utils]);
  var formatter = useMemo(function () {
    return shouldUseMaskedInput && mask ? maskedDateFormatter(mask, acceptRegex) : function (st) {
      return st;
    };
  }, [acceptRegex, mask, shouldUseMaskedInput]);
  useEffect(function () {
    // We do not need to update the input value on keystroke
    // Because library formatters can change inputs from 12/12/2 to 12/12/0002
    if ((rawValue === null || utils.isValid(rawValue)) && !isFocusedRef.current) {
      setInnerInputValue(getInputValue());
    }
  }, [utils, getInputValue, rawValue]);

  var handleChange = function handleChange(text) {
    var finalString = text === '' || text === mask ? '' : text;
    setInnerInputValue(finalString);
    var date = finalString === null ? null : utils.parse(finalString, inputFormat);

    if (ignoreInvalidInputs && !utils.isValid(date)) {
      return;
    }

    onChange(date, finalString || undefined);
  };

  var rifmProps = useRifm({
    value: innerInputValue,
    onChange: handleChange,
    format: rifmFormatter || formatter
  });
  var inputStateArgs = shouldUseMaskedInput ? rifmProps : {
    value: innerInputValue,
    onChange: function onChange(event) {
      handleChange(event.currentTarget.value);
    }
  };
  return _objectSpread({
    label: label,
    disabled: disabled,
    error: validationError,
    helperText: formatHelperText,
    inputProps: _objectSpread(_objectSpread(_objectSpread({}, inputStateArgs), {}, {
      disabled: disabled,
      // make spreading in custom input easier
      placeholder: formatHelperText,
      readOnly: readOnly,
      type: shouldUseMaskedInput ? 'tel' : 'text'
    }, inputProps), {}, {
      onFocus: createDelegatedEventHandler(function () {
        isFocusedRef.current = true;
      }, inputProps === null || inputProps === void 0 ? void 0 : inputProps.onFocus),
      onBlur: createDelegatedEventHandler(function () {
        isFocusedRef.current = false;
      }, inputProps === null || inputProps === void 0 ? void 0 : inputProps.onBlur)
    })
  }, TextFieldProps);
}

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var KeyboardDateInput = function KeyboardDateInput(_ref) {
  var containerRef = _ref.containerRef,
      _ref$inputRef = _ref.inputRef,
      inputRef = _ref$inputRef === void 0 ? null : _ref$inputRef,
      _ref$forwardedRef = _ref.forwardedRef,
      forwardedRef = _ref$forwardedRef === void 0 ? null : _ref$forwardedRef,
      hideOpenPickerButton = _ref.disableOpenPicker,
      _ref$getOpenDialogAri = _ref.getOpenDialogAriaText,
      getOpenDialogAriaText = _ref$getOpenDialogAri === void 0 ? getTextFieldAriaText : _ref$getOpenDialogAri,
      InputAdornmentProps = _ref.InputAdornmentProps,
      InputProps = _ref.InputProps,
      onOpen = _ref.openPicker,
      OpenPickerButtonProps = _ref.OpenPickerButtonProps,
      _ref$openPickerIcon = _ref.openPickerIcon,
      openPickerIcon = _ref$openPickerIcon === void 0 ? /*#__PURE__*/createElement(CalendarIcon, null) : _ref$openPickerIcon,
      renderInput = _ref.renderInput,
      other = _objectWithoutProperties(_ref, ["containerRef", "inputRef", "forwardedRef", "disableOpenPicker", "getOpenDialogAriaText", "InputAdornmentProps", "InputProps", "openPicker", "OpenPickerButtonProps", "openPickerIcon", "renderInput"]);

  var utils = useUtils();
  var inputRefHandle = useForkRef(inputRef, forwardedRef);
  var textFieldProps = useMaskedInput(other);
  var adornmentPosition = (InputAdornmentProps === null || InputAdornmentProps === void 0 ? void 0 : InputAdornmentProps.position) || 'end';
  return renderInput(_objectSpread$1(_objectSpread$1({
    ref: containerRef,
    inputRef: inputRefHandle
  }, textFieldProps), {}, {
    InputProps: _objectSpread$1(_objectSpread$1({}, InputProps), {}, _defineProperty({}, "".concat(adornmentPosition, "Adornment"), hideOpenPickerButton ? undefined : /*#__PURE__*/createElement(InputAdornment, _extends({
      position: adornmentPosition
    }, InputAdornmentProps), /*#__PURE__*/createElement(IconButton, _extends({
      edge: adornmentPosition,
      "data-mui-test": "open-picker-from-keyboard",
      disabled: other.disabled,
      "aria-label": getOpenDialogAriaText(other.rawValue, utils)
    }, OpenPickerButtonProps, {
      onClick: onOpen
    }), openPickerIcon))))
  }));
};
process.env.NODE_ENV !== "production" ? KeyboardDateInput.propTypes = {
  acceptRegex: instanceOf(RegExp),
  getOpenDialogAriaText: func,
  mask: string,
  OpenPickerButtonProps: object,
  openPickerIcon: node,
  renderInput: func.isRequired,
  rifmFormatter: func
} : void 0;

function useParsedDate(possiblyUnparsedValue) {
  var utils = useUtils();
  return useMemo(function () {
    return typeof possiblyUnparsedValue === 'undefined' ? undefined : utils.date(possiblyUnparsedValue);
  }, [possiblyUnparsedValue, utils]);
}
function useNextMonthDisabled(month, _ref) {
  var disableFuture = _ref.disableFuture,
      maxDate = _ref.maxDate;
  var utils = useUtils();
  return useMemo(function () {
    var now = utils.date();
    var lastEnabledMonth = utils.startOfMonth(disableFuture && utils.isBefore(now, maxDate) ? now : maxDate);
    return !utils.isAfter(lastEnabledMonth, month);
  }, [disableFuture, maxDate, month, utils]);
}
function usePreviousMonthDisabled(month, _ref2) {
  var disablePast = _ref2.disablePast,
      minDate = _ref2.minDate;
  var utils = useUtils();
  return useMemo(function () {
    var now = utils.date();
    var firstEnabledMonth = utils.startOfMonth(disablePast && utils.isAfter(now, minDate) ? now : minDate);
    return !utils.isBefore(firstEnabledMonth, month);
  }, [disablePast, minDate, month, utils]);
}

var date = oneOfType([object, string, number, instanceOf(Date)]);
var datePickerView = oneOf(['year', 'month', 'day']);
var defaultMinDate = new Date('1900-01-01');
var defaultMaxDate = new Date('2099-12-31');

function useViews(_ref) {
  var views = _ref.views,
      openTo = _ref.openTo,
      onChange = _ref.onChange,
      isMobileKeyboardViewOpen = _ref.isMobileKeyboardViewOpen,
      toggleMobileKeyboardView = _ref.toggleMobileKeyboardView;

  var _React$useState = useState(openTo && arrayIncludes(views, openTo) ? openTo : views[0]),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      openView = _React$useState2[0],
      setOpenView = _React$useState2[1];

  var setOpenViewEnhanced = useCallback(function () {
    if (isMobileKeyboardViewOpen) {
      toggleMobileKeyboardView();
    }

    setOpenView.apply(void 0, arguments);
  }, [isMobileKeyboardViewOpen, toggleMobileKeyboardView]);
  var previousView = views[views.indexOf(openView) - 1];
  var nextView = views[views.indexOf(openView) + 1];
  var openNext = useCallback(function () {
    if (nextView) {
      setOpenViewEnhanced(nextView);
    }
  }, [nextView, setOpenViewEnhanced]);
  var handleChangeAndOpenNext = useCallback(function (date, currentViewSelectionState) {
    var isSelectionFinishedOnCurrentView = currentViewSelectionState === 'finish';
    var globalSelectionState = isSelectionFinishedOnCurrentView && Boolean(nextView) ? 'partial' : currentViewSelectionState;
    onChange(date, globalSelectionState);

    if (isSelectionFinishedOnCurrentView) {
      openNext();
    }
  }, [nextView, onChange, openNext]);
  return {
    nextView: nextView,
    previousView: previousView,
    openNext: openNext,
    handleChangeAndOpenNext: handleChangeAndOpenNext,
    openView: openView,
    setOpenView: setOpenViewEnhanced
  };
}

var useStyles = makeStyles(function (theme) {
  return {
    root: {
      flex: '1 0 33.33%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      outline: 'none',
      height: 64,
      transition: theme.transitions.create('font-size', {
        duration: '100ms'
      }),
      '&:focus': {
        color: theme.palette.primary.main,
        fontWeight: theme.typography.fontWeightMedium
      },
      '&:disabled': {
        pointerEvents: 'none',
        color: theme.palette.text.secondary
      },
      '&$selected': {
        color: theme.palette.primary.main,
        fontWeight: theme.typography.fontWeightMedium
      }
    },
    selected: {}
  };
}, {
  name: 'MuiPickersMonth'
});
var Month = function Month(props) {
  var disabled = props.disabled,
      onSelect = props.onSelect,
      selected = props.selected,
      value = props.value,
      other = _objectWithoutProperties(props, ["disabled", "onSelect", "selected", "value"]);

  var classes = useStyles();

  var handleSelection = function handleSelection() {
    onSelect(value);
  };

  return /*#__PURE__*/createElement(Typography, _extends({
    "data-mui-test": "month",
    role: "button",
    component: "div",
    className: clsx(classes.root, selected && classes.selected),
    tabIndex: disabled ? -1 : 0,
    onClick: handleSelection,
    onKeyDown: onSpaceOrEnter(handleSelection),
    color: selected ? 'primary' : undefined,
    variant: selected ? 'h5' : 'subtitle1'
  }, other));
};
Month.displayName = 'Month';

var useStyles$1 = makeStyles({
  root: {
    width: 310,
    display: 'flex',
    flexWrap: 'wrap',
    alignContent: 'stretch'
  }
}, {
  name: 'MuiPickersMonthSelection'
});
function MonthSelection(_ref) {
  var date = _ref.date,
      disableFuture = _ref.disableFuture,
      disablePast = _ref.disablePast,
      maxDate = _ref.maxDate,
      minDate = _ref.minDate,
      onChange = _ref.onChange,
      onMonthChange = _ref.onMonthChange;
  var utils = useUtils();
  var now = useNow();
  var classes = useStyles$1();
  var currentMonth = utils.getMonth(date || now);

  var shouldDisableMonth = function shouldDisableMonth(month) {
    var firstEnabledMonth = utils.startOfMonth(disablePast && utils.isAfter(now, minDate) ? now : minDate);
    var lastEnabledMonth = utils.startOfMonth(disableFuture && utils.isBefore(now, maxDate) ? now : maxDate);
    var isBeforeFirstEnabled = utils.isBefore(month, firstEnabledMonth);
    var isAfterLastEnabled = utils.isAfter(month, lastEnabledMonth);
    return isBeforeFirstEnabled || isAfterLastEnabled;
  };

  var onMonthSelect = useCallback(function (month) {
    var newDate = utils.setMonth(date || now, month);
    onChange(newDate, 'finish');

    if (onMonthChange) {
      onMonthChange(newDate);
    }
  }, [date, now, onChange, onMonthChange, utils]);
  return /*#__PURE__*/createElement("div", {
    className: classes.root
  }, utils.getMonthArray(date || now).map(function (month) {
    var monthNumber = utils.getMonth(month);
    var monthText = utils.format(month, 'monthShort');
    return /*#__PURE__*/createElement(Month, {
      key: monthText,
      value: monthNumber,
      selected: monthNumber === currentMonth,
      onSelect: onMonthSelect,
      disabled: shouldDisableMonth(month)
    }, monthText);
  }));
}

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var createCalendarStateReducer = function createCalendarStateReducer(reduceAnimations, disableSwitchToMonthOnDayFocus, utils) {
  return function (state, action) {
    switch (action.type) {
      case 'changeMonth':
        return _objectSpread$2(_objectSpread$2({}, state), {}, {
          slideDirection: action.direction,
          currentMonth: action.newMonth,
          isMonthSwitchingAnimating: !reduceAnimations
        });

      case 'finishMonthSwitchingAnimation':
        return _objectSpread$2(_objectSpread$2({}, state), {}, {
          isMonthSwitchingAnimating: false
        });

      case 'changeFocusedDay':
        {
          var needMonthSwitch = Boolean(action.focusedDay) && !disableSwitchToMonthOnDayFocus && !utils.isSameMonth(state.currentMonth, action.focusedDay);
          return _objectSpread$2(_objectSpread$2({}, state), {}, {
            focusedDay: action.focusedDay,
            isMonthSwitchingAnimating: needMonthSwitch && !reduceAnimations,
            currentMonth: needMonthSwitch ? utils.startOfMonth(action.focusedDay) : state.currentMonth,
            slideDirection: utils.isAfterDay(action.focusedDay, state.currentMonth) ? 'left' : 'right'
          });
        }

      default:
        throw new Error('missing support');
    }
  };
};
function useCalendarState(_ref) {
  var date = _ref.date,
      disableFuture = _ref.disableFuture,
      disablePast = _ref.disablePast,
      _ref$disableSwitchToM = _ref.disableSwitchToMonthOnDayFocus,
      disableSwitchToMonthOnDayFocus = _ref$disableSwitchToM === void 0 ? false : _ref$disableSwitchToM,
      maxDate = _ref.maxDate,
      minDate = _ref.minDate,
      onMonthChange = _ref.onMonthChange,
      reduceAnimations = _ref.reduceAnimations,
      shouldDisableDate = _ref.shouldDisableDate;
  var now = useNow();
  var utils = useUtils();
  var dateForMonth = date || now;
  var reducerFn = useRef(createCalendarStateReducer(Boolean(reduceAnimations), disableSwitchToMonthOnDayFocus, utils)).current;

  var _React$useReducer = useReducer(reducerFn, {
    isMonthSwitchingAnimating: false,
    focusedDay: date,
    currentMonth: utils.startOfMonth(dateForMonth),
    slideDirection: 'left'
  }),
      _React$useReducer2 = _slicedToArray(_React$useReducer, 2),
      calendarState = _React$useReducer2[0],
      dispatch = _React$useReducer2[1];

  var handleChangeMonth = useCallback(function (payload) {
    dispatch(_objectSpread$2({
      type: 'changeMonth'
    }, payload));

    if (onMonthChange) {
      onMonthChange(payload.newMonth);
    }
  }, [onMonthChange]);
  var changeMonth = useCallback(function (newDate) {
    var newDateRequested = newDate !== null && newDate !== void 0 ? newDate : now;

    if (utils.isSameMonth(newDateRequested, calendarState.currentMonth)) {
      return;
    }

    handleChangeMonth({
      newMonth: utils.startOfMonth(newDateRequested),
      direction: utils.isAfterDay(newDateRequested, calendarState.currentMonth) ? 'left' : 'right'
    });
  }, [calendarState.currentMonth, handleChangeMonth, now, utils]);
  var isDateDisabled = useCallback(function (day) {
    return validateDate(utils, day, {
      disablePast: disablePast,
      disableFuture: disableFuture,
      minDate: minDate,
      maxDate: maxDate,
      shouldDisableDate: shouldDisableDate
    }) !== null;
  }, [disableFuture, disablePast, maxDate, minDate, shouldDisableDate, utils]);
  var onMonthSwitchingAnimationEnd = useCallback(function () {
    dispatch({
      type: 'finishMonthSwitchingAnimation'
    });
  }, []);
  var changeFocusedDay = useCallback(function (newFocusedDate) {
    if (!isDateDisabled(newFocusedDate)) {
      dispatch({
        type: 'changeFocusedDay',
        focusedDay: newFocusedDate
      });
    }
  }, [isDateDisabled]);
  return {
    calendarState: calendarState,
    changeMonth: changeMonth,
    changeFocusedDay: changeFocusedDay,
    isDateDisabled: isDateDisabled,
    onMonthSwitchingAnimationEnd: onMonthSwitchingAnimationEnd,
    handleChangeMonth: handleChangeMonth
  };
}

var animationDuration = 500;
var useStyles$2 = makeStyles(function (theme) {
  return {
    root: {
      display: 'block',
      position: 'relative'
    },
    fadeEnter: {
      willChange: 'transform',
      opacity: 0
    },
    fadeEnterActive: {
      opacity: 1,
      transition: theme.transitions.create('opacity', {
        duration: animationDuration
      })
    },
    fadeExit: {
      opacity: 1
    },
    fadeExitActive: {
      opacity: 0,
      transition: theme.transitions.create('opacity', {
        duration: animationDuration / 2
      })
    }
  };
}, {
  name: 'MuiPickersFadeTransition'
});
var FadeTransitionGroup = function FadeTransitionGroup(_ref) {
  var children = _ref.children,
      className = _ref.className,
      reduceAnimations = _ref.reduceAnimations,
      transKey = _ref.transKey;
  var classes = useStyles$2();

  if (reduceAnimations) {
    return children;
  }

  var transitionClasses = {
    exit: classes.fadeExit,
    enterActive: classes.fadeEnterActive,
    enter: classes.fadeEnter,
    exitActive: classes.fadeExitActive
  };
  return /*#__PURE__*/createElement(TransitionGroup, {
    className: clsx(classes.root, className),
    childFactory: function childFactory(element) {
      return cloneElement(element, {
        classNames: transitionClasses
      });
    }
  }, /*#__PURE__*/createElement(CSSTransition, {
    mountOnEnter: true,
    unmountOnExit: true,
    key: transKey,
    timeout: {
      appear: animationDuration,
      enter: animationDuration / 2,
      exit: 0
    },
    classNames: transitionClasses
  }, children));
};

/**
 * @ignore - internal component.
 */

var ArrowDropDownIcon = createSvgIcon( /*#__PURE__*/createElement("path", {
  d: "M7 10l5 5 5-5z"
}), 'ArrowDropDown');

var useStyles$3 = makeStyles(function (theme) {
  return {
    root: {
      display: 'flex',
      alignItems: 'center',
      marginTop: 16,
      marginBottom: 8,
      paddingLeft: 24,
      paddingRight: 12,
      // prevent jumping in safari
      maxHeight: 30,
      minHeight: 30
    },
    yearSelectionSwitcher: {
      marginRight: 'auto'
    },
    previousMonthButton: {
      marginRight: 24
    },
    switchViewDropdown: {
      willChange: 'transform',
      transition: theme.transitions.create('transform'),
      transform: 'rotate(0deg)'
    },
    switchViewDropdownDown: {
      transform: 'rotate(180deg)'
    },
    monthTitleContainer: {
      display: 'flex',
      maxHeight: 30,
      overflow: 'hidden',
      cursor: 'pointer',
      marginRight: 'auto'
    },
    monthText: {
      marginRight: 4
    }
  };
}, {
  name: 'MuiPickersCalendarHeader'
});

function getSwitchingViewAriaText(view) {
  return view === 'year' ? 'year view is open, switch to calendar view' : 'calendar view is open, switch to year view';
}

function CalendarHeader(props) {
  var currentView = props.view,
      views = props.views,
      month = props.currentMonth,
      changeView = props.changeView,
      minDate = props.minDate,
      maxDate = props.maxDate,
      disablePast = props.disablePast,
      disableFuture = props.disableFuture,
      onMonthChange = props.onMonthChange,
      reduceAnimations = props.reduceAnimations,
      leftArrowButtonProps = props.leftArrowButtonProps,
      rightArrowButtonProps = props.rightArrowButtonProps,
      leftArrowIcon = props.leftArrowIcon,
      rightArrowIcon = props.rightArrowIcon,
      _props$leftArrowButto = props.leftArrowButtonText,
      leftArrowButtonText = _props$leftArrowButto === void 0 ? 'previous month' : _props$leftArrowButto,
      _props$rightArrowButt = props.rightArrowButtonText,
      rightArrowButtonText = _props$rightArrowButt === void 0 ? 'next month' : _props$rightArrowButt,
      _props$getViewSwitchi = props.getViewSwitchingButtonText,
      getViewSwitchingButtonText = _props$getViewSwitchi === void 0 ? getSwitchingViewAriaText : _props$getViewSwitchi;
  var utils = useUtils();
  var classes = useStyles$3();

  var selectNextMonth = function selectNextMonth() {
    return onMonthChange(utils.getNextMonth(month), 'left');
  };

  var selectPreviousMonth = function selectPreviousMonth() {
    return onMonthChange(utils.getPreviousMonth(month), 'right');
  };

  var isNextMonthDisabled = useNextMonthDisabled(month, {
    disableFuture: disableFuture,
    maxDate: maxDate
  });
  var isPreviousMonthDisabled = usePreviousMonthDisabled(month, {
    disablePast: disablePast,
    minDate: minDate
  });

  var toggleView = function toggleView() {
    if (views.length === 1) {
      return;
    }

    if (views.length === 2) {
      changeView(views.find(function (view) {
        return view !== currentView;
      }) || views[0]);
    } else {
      // switching only between first 2
      var nextIndexToOpen = views.indexOf(currentView) !== 0 ? 0 : 1;
      changeView(views[nextIndexToOpen]);
    }
  };

  return /*#__PURE__*/createElement(Fragment, null, /*#__PURE__*/createElement("div", {
    className: classes.root
  }, /*#__PURE__*/createElement("div", {
    className: classes.monthTitleContainer,
    onClick: toggleView
  }, /*#__PURE__*/createElement(FadeTransitionGroup, {
    reduceAnimations: reduceAnimations,
    transKey: utils.format(month, 'month')
  }, /*#__PURE__*/createElement(Typography, {
    "aria-live": "polite",
    "data-mui-test": "calendar-month-text",
    align: "center",
    variant: "subtitle1",
    className: classes.monthText
  }, utils.format(month, 'month'))), /*#__PURE__*/createElement(FadeTransitionGroup, {
    reduceAnimations: reduceAnimations,
    transKey: utils.format(month, 'year')
  }, /*#__PURE__*/createElement(Typography, {
    "aria-live": "polite",
    "data-mui-test": "calendar-year-text",
    align: "center",
    variant: "subtitle1"
  }, utils.format(month, 'year'))), views.length > 1 && /*#__PURE__*/createElement(IconButton, {
    size: "small",
    "data-mui-test": "calendar-view-switcher",
    onClick: toggleView,
    className: classes.yearSelectionSwitcher,
    "aria-label": getViewSwitchingButtonText(currentView)
  }, /*#__PURE__*/createElement(ArrowDropDownIcon, {
    className: clsx(classes.switchViewDropdown, currentView === 'year' && classes.switchViewDropdownDown)
  }))), /*#__PURE__*/createElement(Fade, {
    "in": currentView === 'date'
  }, /*#__PURE__*/createElement(ArrowSwitcher, {
    leftArrowButtonProps: leftArrowButtonProps,
    rightArrowButtonProps: rightArrowButtonProps,
    leftArrowButtonText: leftArrowButtonText,
    rightArrowButtonText: rightArrowButtonText,
    leftArrowIcon: leftArrowIcon,
    rightArrowIcon: rightArrowIcon,
    onLeftClick: selectPreviousMonth,
    onRightClick: selectNextMonth,
    isLeftDisabled: isPreviousMonthDisabled,
    isRightDisabled: isNextMonthDisabled
  }))));
}
CalendarHeader.displayName = 'PickersCalendarHeader';
process.env.NODE_ENV !== "production" ? CalendarHeader.propTypes = {
  leftArrowButtonText: string,
  leftArrowIcon: node,
  rightArrowButtonText: string,
  rightArrowIcon: node
} : void 0;

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
var useStyles$4 = makeStyles(function (theme) {
  return {
    root: {
      flexBasis: '33.3%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      '&$disabled': {
        color: theme.palette.text.secondary
      },
      '&$selected': {
        color: theme.palette.getContrastText(theme.palette.primary.main),
        backgroundColor: theme.palette.primary.main,
        '&:focus, &:hover': {
          backgroundColor: theme.palette.primary.dark
        }
      }
    },
    modeDesktop: {
      flexBasis: '25%'
    },
    yearButton: _objectSpread$3(_objectSpread$3({
      color: 'unset',
      backgroundColor: 'transparent',
      border: 'none',
      outline: 0
    }, theme.typography.subtitle1), {}, {
      margin: '8px 0',
      height: 36,
      width: 72,
      borderRadius: 16,
      cursor: 'pointer',
      '&:focus, &:hover': {
        backgroundColor: fade(theme.palette.action.active, theme.palette.action.hoverOpacity)
      }
    }),
    disabled: {},
    selected: {}
  };
}, {
  name: 'MuiPickersYear'
});
var Year = function Year(props) {
  var allowKeyboardControl = props.allowKeyboardControl,
      children = props.children,
      disabled = props.disabled,
      focused = props.focused,
      forwardedRef = props.forwardedRef,
      onSelect = props.onSelect,
      selected = props.selected,
      value = props.value;
  var classes = useStyles$4();
  var ref = useRef(null);
  var refHandle = useForkRef(ref, forwardedRef);
  var canAutoFocus = useCanAutoFocus();
  var wrapperVariant = useContext(WrapperVariantContext);
  useEffect(function () {
    if (canAutoFocus && focused && ref.current && !disabled && allowKeyboardControl) {
      ref.current.focus();
    }
  }, [allowKeyboardControl, canAutoFocus, disabled, focused]);
  return /*#__PURE__*/createElement("div", {
    "data-mui-test": "year",
    className: clsx(classes.root, wrapperVariant === 'desktop' && classes.modeDesktop)
  }, /*#__PURE__*/createElement("button", {
    ref: refHandle,
    disabled: disabled,
    type: "button",
    "data-mui-test": "year-".concat(children),
    tabIndex: selected ? 0 : -1,
    onClick: function onClick() {
      return onSelect(value);
    },
    onKeyDown: onSpaceOrEnter(function () {
      return onSelect(value);
    }),
    className: clsx(classes.yearButton, disabled && classes.disabled, selected && classes.selected)
  }, children));
};
var Year$1 = forwardRef(function (props, ref) {
  return /*#__PURE__*/createElement(Year, _extends({}, props, {
    forwardedRef: ref
  }));
});

var useStyles$5 = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    overflowY: 'auto',
    height: '100%',
    margin: '0 4px'
  }
}, {
  name: 'MuiPickersYearSelection'
});
function YearSelection(_ref) {
  var _useGlobalKeyDown;

  var allowKeyboardControl = _ref.allowKeyboardControl,
      changeFocusedDay = _ref.changeFocusedDay,
      __dateOrNull = _ref.date,
      isDateDisabled = _ref.isDateDisabled,
      maxDate = _ref.maxDate,
      minDate = _ref.minDate,
      disableFuture = _ref.disableFuture,
      disablePast = _ref.disablePast,
      onChange = _ref.onChange,
      onYearChange = _ref.onYearChange,
      shouldDisableYear = _ref.shouldDisableYear;
  var now = useNow();
  var theme = useTheme();
  var utils = useUtils();
  var classes = useStyles$5();
  var selectedDate = __dateOrNull || now;
  var currentYear = utils.getYear(selectedDate);
  var wrapperVariant = useContext(WrapperVariantContext);
  var selectedYearRef = useRef(null);

  var _React$useState = useState(currentYear),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      focusedYear = _React$useState2[0],
      setFocusedYear = _React$useState2[1];

  var handleYearSelection = useCallback(function (year) {
    var isFinish = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'finish';

    var submitDate = function submitDate(newDate) {
      onChange(newDate, isFinish);
      changeFocusedDay(newDate || now);

      if (onYearChange) {
        onYearChange(newDate);
      }
    };

    var newDate = utils.setYear(selectedDate, year);

    if (isDateDisabled(newDate)) {
      var closestEnabledDate = findClosestEnabledDate({
        utils: utils,
        date: newDate,
        minDate: minDate,
        maxDate: maxDate,
        disablePast: Boolean(disablePast),
        disableFuture: Boolean(disableFuture),
        shouldDisableDate: isDateDisabled
      });
      submitDate(closestEnabledDate);
    } else {
      submitDate(newDate);
    }
  }, [utils, now, selectedDate, isDateDisabled, onChange, changeFocusedDay, onYearChange, minDate, maxDate, disablePast, disableFuture]);
  var focusYear = useCallback(function (year) {
    if (!isDateDisabled(utils.setYear(selectedDate, year))) {
      setFocusedYear(year);
    }
  }, [selectedDate, isDateDisabled, utils]);
  var yearsInRow = wrapperVariant === 'desktop' ? 4 : 3;
  var nowFocusedYear = focusedYear || currentYear;
  useGlobalKeyDown(Boolean(allowKeyboardControl), (_useGlobalKeyDown = {}, _defineProperty(_useGlobalKeyDown, keycode.ArrowUp, function () {
    return focusYear(nowFocusedYear - yearsInRow);
  }), _defineProperty(_useGlobalKeyDown, keycode.ArrowDown, function () {
    return focusYear(nowFocusedYear + yearsInRow);
  }), _defineProperty(_useGlobalKeyDown, keycode.ArrowLeft, function () {
    return focusYear(nowFocusedYear + (theme.direction === 'ltr' ? -1 : 1));
  }), _defineProperty(_useGlobalKeyDown, keycode.ArrowRight, function () {
    return focusYear(nowFocusedYear + (theme.direction === 'ltr' ? 1 : -1));
  }), _useGlobalKeyDown));
  return /*#__PURE__*/createElement("div", {
    className: classes.root
  }, utils.getYearRange(minDate, maxDate).map(function (year) {
    var yearNumber = utils.getYear(year);
    var selected = yearNumber === currentYear;
    return /*#__PURE__*/createElement(Year$1, {
      key: utils.format(year, 'year'),
      selected: selected,
      value: yearNumber,
      onSelect: handleYearSelection,
      allowKeyboardControl: allowKeyboardControl,
      focused: yearNumber === focusedYear,
      ref: selected ? selectedYearRef : undefined,
      disabled: disablePast && utils.isBeforeYear(year, now) || disableFuture && utils.isAfterYear(year, now) || shouldDisableYear && shouldDisableYear(year)
    }, utils.format(year, 'year'));
  }));
}

var muiComponentConfig = {
  name: 'MuiPickersCalendarView'
};
var useStyles$6 = makeStyles({
  viewTransitionContainer: {
    overflowY: 'auto'
  },
  fullHeightContainer: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: (DAY_SIZE + DAY_MARGIN * 4) * 7,
    height: '100%'
  }
}, muiComponentConfig);
var defaultReduceAnimations = typeof navigator !== 'undefined' && /(android)/i.test(navigator.userAgent);
function CalendarView(props) {
  var _useDefaultProps = useDefaultProps(props, muiComponentConfig),
      allowKeyboardControlProp = _useDefaultProps.allowKeyboardControl,
      changeView = _useDefaultProps.changeView,
      date = _useDefaultProps.date,
      disableFuture = _useDefaultProps.disableFuture,
      disablePast = _useDefaultProps.disablePast,
      loading = _useDefaultProps.loading,
      maxDateProp = _useDefaultProps.maxDate,
      minDateProp = _useDefaultProps.minDate,
      onChange = _useDefaultProps.onChange,
      onMonthChange = _useDefaultProps.onMonthChange,
      _useDefaultProps$redu = _useDefaultProps.reduceAnimations,
      reduceAnimations = _useDefaultProps$redu === void 0 ? defaultReduceAnimations : _useDefaultProps$redu,
      renderLoading = _useDefaultProps.renderLoading,
      shouldDisableDate = _useDefaultProps.shouldDisableDate,
      shouldDisableYear = _useDefaultProps.shouldDisableYear,
      view = _useDefaultProps.view,
      other = _objectWithoutProperties(_useDefaultProps, ["allowKeyboardControl", "changeView", "date", "disableFuture", "disablePast", "loading", "maxDate", "minDate", "onChange", "onMonthChange", "reduceAnimations", "renderLoading", "shouldDisableDate", "shouldDisableYear", "view"]);

  var utils = useUtils();
  var classes = useStyles$6();
  var isStatic = useContext(IsStaticVariantContext);
  var allowKeyboardControl = allowKeyboardControlProp !== null && allowKeyboardControlProp !== void 0 ? allowKeyboardControlProp : !isStatic;
  var minDate = minDateProp || utils.date(defaultMinDate);
  var maxDate = maxDateProp || utils.date(defaultMaxDate);

  var _useCalendarState = useCalendarState({
    date: date,
    reduceAnimations: reduceAnimations,
    onMonthChange: onMonthChange,
    minDate: minDate,
    maxDate: maxDate,
    shouldDisableDate: shouldDisableDate,
    disablePast: disablePast,
    disableFuture: disableFuture
  }),
      calendarState = _useCalendarState.calendarState,
      changeFocusedDay = _useCalendarState.changeFocusedDay,
      changeMonth = _useCalendarState.changeMonth,
      isDateDisabled = _useCalendarState.isDateDisabled,
      handleChangeMonth = _useCalendarState.handleChangeMonth,
      onMonthSwitchingAnimationEnd = _useCalendarState.onMonthSwitchingAnimationEnd;

  useEffect(function () {
    if (date && isDateDisabled(date)) {
      var closestEnabledDate = findClosestEnabledDate({
        utils: utils,
        date: date,
        minDate: minDate,
        maxDate: maxDate,
        disablePast: Boolean(disablePast),
        disableFuture: Boolean(disableFuture),
        shouldDisableDate: isDateDisabled
      });
      onChange(closestEnabledDate, 'partial');
    } // This call is too expensive to run it on each prop change.
    // So just ensure that we are not rendering disabled as selected on mount.

  }, []); // eslint-disable-line

  useEffect(function () {
    changeMonth(date);
  }, [date]); // eslint-disable-line

  return /*#__PURE__*/createElement(Fragment, null, /*#__PURE__*/createElement(CalendarHeader, _extends({}, other, {
    view: view,
    currentMonth: calendarState.currentMonth,
    changeView: changeView,
    onMonthChange: function onMonthChange(newMonth, direction) {
      return handleChangeMonth({
        newMonth: newMonth,
        direction: direction
      });
    },
    minDate: minDate,
    maxDate: maxDate,
    disablePast: disablePast,
    disableFuture: disableFuture,
    reduceAnimations: reduceAnimations
  })), /*#__PURE__*/createElement(FadeTransitionGroup, {
    reduceAnimations: reduceAnimations,
    className: classes.viewTransitionContainer,
    transKey: view
  }, /*#__PURE__*/createElement("div", null, view === 'year' && /*#__PURE__*/createElement(YearSelection, _extends({}, other, {
    date: date,
    onChange: onChange,
    minDate: minDate,
    maxDate: maxDate,
    disableFuture: disableFuture,
    disablePast: disablePast,
    isDateDisabled: isDateDisabled,
    allowKeyboardControl: allowKeyboardControl,
    shouldDisableYear: shouldDisableYear,
    changeFocusedDay: changeFocusedDay
  })), view === 'month' && /*#__PURE__*/createElement(MonthSelection, _extends({}, other, {
    date: date,
    onChange: onChange,
    minDate: minDate,
    maxDate: maxDate,
    onMonthChange: onMonthChange
  })), view === 'date' && /*#__PURE__*/createElement(Calendar, _extends({}, other, calendarState, {
    onMonthSwitchingAnimationEnd: onMonthSwitchingAnimationEnd,
    changeFocusedDay: changeFocusedDay,
    reduceAnimations: reduceAnimations,
    date: date,
    onChange: onChange,
    isDateDisabled: isDateDisabled,
    allowKeyboardControl: allowKeyboardControl,
    loading: loading,
    renderLoading: renderLoading
  })))));
}

var getOrientation = function getOrientation() {
  if (typeof window === 'undefined') {
    return 'portrait';
  }

  if (window.screen && window.screen.orientation && window.screen.orientation.angle) {
    return Math.abs(window.screen.orientation.angle) === 90 ? 'landscape' : 'portrait';
  } // Support IOS safari


  if (window.orientation) {
    return Math.abs(Number(window.orientation)) === 90 ? 'landscape' : 'portrait';
  }

  return 'portrait';
};

function useIsLandscape(views, customOrientation) {
  var _React$useState = useState(getOrientation()),
      _React$useState2 = _slicedToArray(_React$useState, 2),
      orientation = _React$useState2[0],
      setOrientation = _React$useState2[1];

  useIsomorphicEffect(function () {
    var eventHandler = function eventHandler() {
      setOrientation(getOrientation());
    };

    window.addEventListener('orientationchange', eventHandler);
    return function () {
      window.removeEventListener('orientationchange', eventHandler);
    };
  }, []);

  if (arrayIncludes(views, ['hours', 'minutes', 'seconds'])) {
    // could not display 13:34:44 in landscape mode
    return false;
  }

  var orientationToUse = customOrientation || orientation;
  return orientationToUse === 'landscape';
}

var MobileKeyboardInputView = styled('div')({
  padding: '16px 24px'
}, {
  name: 'MuiPickersMobileKeyboardInputView'
});

var muiComponentConfig$1 = {
  name: 'MuiPickersBasePicker'
};
var useStyles$7 = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column'
  },
  landscape: {
    flexDirection: 'row'
  },
  pickerView: {
    overflowX: 'hidden',
    width: DIALOG_WIDTH,
    maxHeight: VIEW_HEIGHT,
    display: 'flex',
    flexDirection: 'column',
    margin: '0 auto'
  },
  pickerViewLandscape: {
    padding: '0 8px'
  }
}, muiComponentConfig$1);
var MobileKeyboardTextFieldProps = {
  fullWidth: true
};

var isDatePickerView = function isDatePickerView(view) {
  return view === 'year' || view === 'month' || view === 'date';
};

function Picker(_ref) {
  var className = _ref.className,
      date = _ref.date,
      DateInputProps = _ref.DateInputProps,
      isMobileKeyboardViewOpen = _ref.isMobileKeyboardViewOpen,
      onDateChange = _ref.onDateChange,
      _ref$openTo = _ref.openTo,
      openTo = _ref$openTo === void 0 ? 'date' : _ref$openTo,
      orientation = _ref.orientation,
      showToolbar = _ref.showToolbar,
      toggleMobileKeyboardView = _ref.toggleMobileKeyboardView,
      _ref$ToolbarComponent = _ref.ToolbarComponent,
      ToolbarComponent = _ref$ToolbarComponent === void 0 ? function () {
    return null;
  } : _ref$ToolbarComponent,
      toolbarFormat = _ref.toolbarFormat,
      toolbarPlaceholder = _ref.toolbarPlaceholder,
      toolbarTitle = _ref.toolbarTitle,
      _ref$views = _ref.views,
      views = _ref$views === void 0 ? ['year', 'month', 'date', 'hours', 'minutes', 'seconds'] : _ref$views,
      other = _objectWithoutProperties(_ref, ["className", "date", "DateInputProps", "isMobileKeyboardViewOpen", "onDateChange", "openTo", "orientation", "showToolbar", "toggleMobileKeyboardView", "ToolbarComponent", "toolbarFormat", "toolbarPlaceholder", "toolbarTitle", "views"]);

  var classes = useStyles$7();
  var isLandscape = useIsLandscape(views, orientation);
  var wrapperVariant = useContext(WrapperVariantContext);
  var toShowToolbar = typeof showToolbar === 'undefined' ? wrapperVariant !== 'desktop' : showToolbar;
  var handleDateChange = useCallback(function (date, selectionState) {
    onDateChange(date, wrapperVariant, selectionState);
  }, [onDateChange, wrapperVariant]);

  var _useViews = useViews({
    views: views,
    openTo: openTo,
    onChange: handleDateChange,
    isMobileKeyboardViewOpen: isMobileKeyboardViewOpen,
    toggleMobileKeyboardView: toggleMobileKeyboardView
  }),
      openView = _useViews.openView,
      nextView = _useViews.nextView,
      previousView = _useViews.previousView,
      setOpenView = _useViews.setOpenView,
      handleChangeAndOpenNext = _useViews.handleChangeAndOpenNext;

  return /*#__PURE__*/createElement("div", {
    className: clsx(classes.root, className, isLandscape && classes.landscape)
  }, toShowToolbar && /*#__PURE__*/createElement(ToolbarComponent, _extends({}, other, {
    views: views,
    isLandscape: isLandscape,
    date: date,
    onChange: handleDateChange,
    setOpenView: setOpenView,
    openView: openView,
    toolbarTitle: toolbarTitle,
    toolbarFormat: toolbarFormat,
    toolbarPlaceholder: toolbarPlaceholder,
    isMobileKeyboardViewOpen: isMobileKeyboardViewOpen,
    toggleMobileKeyboardView: toggleMobileKeyboardView
  })), /*#__PURE__*/createElement("div", {
    className: clsx(classes.pickerView, isLandscape && classes.pickerViewLandscape)
  }, isMobileKeyboardViewOpen ? /*#__PURE__*/createElement(MobileKeyboardInputView, null, /*#__PURE__*/createElement(KeyboardDateInput, _extends({}, DateInputProps, {
    ignoreInvalidInputs: true,
    disableOpenPicker: true,
    TextFieldProps: MobileKeyboardTextFieldProps
  }))) : /*#__PURE__*/createElement(Fragment, null, (openView === 'year' || openView === 'month' || openView === 'date') && /*#__PURE__*/createElement(CalendarView, _extends({
    date: date,
    changeView: setOpenView // @ts-ignore
    ,
    views: views,
    onChange: handleChangeAndOpenNext,
    view: openView
  }, other)), (openView === 'hours' || openView === 'minutes' || openView === 'seconds') && /*#__PURE__*/createElement(ClockView, _extends({}, other, {
    date: date,
    type: openView,
    onDateChange: handleDateChange,
    onChange: handleChangeAndOpenNext,
    openNextView: function openNextView() {
      return setOpenView(nextView);
    },
    openPreviousView: function openPreviousView() {
      return setOpenView(previousView);
    },
    nextViewAvailable: !nextView,
    previousViewAvailable: !previousView || isDatePickerView(previousView),
    showViewSwitcher: wrapperVariant === 'desktop'
  })))));
}

var Picker$1 = withDefaultProps(muiComponentConfig$1, Picker);

export { CalendarHeader as C, KeyboardDateInput as K, MobileKeyboardInputView as M, Picker$1 as P, defaultMaxDate as a, isStartOfRange as b, isEndOfRange as c, defaultMinDate as d, useNextMonthDisabled as e, usePreviousMonthDisabled as f, useParsedDate as g, useCalendarState as h, isWithinRange as i, isRangeValid as j, defaultReduceAnimations as k, date as l, CalendarView as m, isYearOnlyView as n, isYearAndMonthViews as o, parseRangeInputValue as p, getFormatAndMaskByViews as q, validateDate as r, pick12hOr24hFormat as s, getDisplayDate as t, useMaskedInput as u, validateDateRange as v, getTextFieldAriaText as w, parsePickerInputValue as x, useStyles$7 as y };
//# sourceMappingURL=Picker-858b30b6.js.map
