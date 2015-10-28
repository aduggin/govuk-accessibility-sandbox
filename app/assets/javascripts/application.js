$(document).ready(function() {

    // selection buttons
    var $blockLabels = $(".block-label input[type='radio'], .block-label input[type='checkbox']");
    new GOVUK.SelectionButtons($blockLabels);

    // Where .block-label uses the data-target attribute to toggle hidden content
    var toggleContent = new ShowHideContent();
    toggleContent.showHideRadioToggledContent();
    toggleContent.showHideCheckboxToggledContent();

    $('.country-autocomplete').each(function (idx, elm) {
      GOVUK.autocompletes.add($(elm));
    });

    // Custom events

    // Bind all autocomplete events
    $.each(['initialized', 'opened', 'closed', 'movedto', 'updated'], function (idx, evt) {
      $(document).bind('typeahead:' + evt, function () {
        var autocompleteEvent = GOVUK.autocompletes.createEvent(evt);

        autocompleteEvent.trigger.apply(GOVUK.autocompletes, arguments);
      });
    });
});
