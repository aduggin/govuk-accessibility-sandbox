$(document).ready(function() {
    console.log(' test case 1');
    var postcode, house;

    var baseurl = "https://api.getAddress.io/v2/uk/";
    var api_key = "OSlYkHkofEObTB83b2IMgQ2004";

    function resetInputText () {
        $("form").find('input:text').val('');
    }

    $('#address-form-uk').hide().attr('aria-hidden', 'true');
    $('#address-form-non-uk').hide().attr('aria-hidden', 'true');
    $("#selected-address").hide().attr('aria-hidden', 'true');
    $("#different-address-group").hide().attr('aria-hidden', 'true');
    $("#continue").attr({'disabled':'disabled', 'aria-disabled':'true'});

    $("#enter-address").on('click', function () {
        $("#house-number-group").hide().attr('aria-hidden', 'true');
        $("#selected-address").show().attr('aria-hidden', 'false');
        $("input[type=submit]").removeAttr('disabled').attr('aria-disabled', 'false');
        $('.error').addClass("hidden");
        $('#address-finder-controls').hide();
    });

    $("#different-address-link").on('click', function(){
        $("#find-address").show().attr('aria-hidden', 'false');
        $("#house-number-group").show().attr('aria-hidden', 'false');
        $('#address-finder-controls').show();
        resetInputText();
        $("#different-address-group").hide().attr('aria-hidden', 'true');
        $("#selected-address").hide().attr('aria-hidden', 'true');
        $('.error').addClass("hidden").attr('aria-hidden', 'true');
    });

    $("input[name='choose-country']").on('change', function() {
        console.log($(this));
        if($(this).val() != 'UK'){
            $("#address-form-uk").hide().attr('aria-hidden', 'true');
            $("#address-form-non-uk").show().attr('aria-hidden', 'false');
            resetInputText();
        }else{
            resetInputText();
            $("#address-form-uk").show().attr('aria-hidden', 'false');
            $("#address-form-non-uk").hide().attr('aria-hidden', 'true');
        }
    });

    $("#find-address-btn").on('click', function() {
        postcode = $("#postcode").val();
        house = $("#house-number").val();
        url = baseurl + "/" + postcode + "?api-key=" + api_key;

        if(house != 'undefined')
            url = baseurl + "/" + postcode + "/" + house + "?api-key=" + api_key;

        $.ajax({
            url: url,
            statusCode: {
                404: function() {
                    console.log( "page not found" );
                    $('.error').removeClass("hidden");
                },
                429: function(){
                    console.log("too many requests");
                }
            }
        })
            .done(function(result){
                $('.error').addClass("hidden");
                console.log(result);

                $("#address-finder-controls").hide();
                $("#postcode-end-group").show();
                $("#different-address-group").show();
                $("#selected-address").show();
                $("#house-number-group").hide();

                if(result.Addresses.length == 1){
                    var address = result.Addresses[0].split(", ");

                    $("#line1").val(address[0]);
                    $("#line2").val(address[1]);
                    $("#line3").val(address[2]);
                    $("#city").val(address[5]);
                    $("#county").val(address[6]);
                    $("#postcode-end").val(postcode);
                    $("input[type=submit]").removeAttr('disabled');
                }
                else {
                    var list = $("#address-list");
                    var found_address_list = $("#found-address-list");
                    var index = 1;
                    $.each(result.Addresses, function() {

                        var formatted_address = this.replace(/ ,/g, "");
                        found_address_list.append('<div class="form-group"><label><input type="radio" name="address" />'+formatted_address+'</label></div>');
                        index++;
                    });
                    $("#found-address-list").removeClass("hidden");

                    $("input[name='address']").change(function(){

                        var address_selected = $(this).parent().text();
                        console.log(address_selected);
                        var formatted_text = address_selected.split(', ');

                        //getting the known values positions
                        $("#city").val(formatted_text[formatted_text.length-2]);
                        $("#county").val(formatted_text[formatted_text.length-1]);

                        //getting the rest of lines
                        for (var i = 0; i < formatted_text.length-2; i++) {
                            if(i < 3)
                                $("#line"+(i+1)).val(formatted_text[i]);
                        }
                        $("#found-address-list").addClass("hidden");
                        $("input[type=submit]").removeAttr('disabled');

                    });
                }
            });
    });
})
