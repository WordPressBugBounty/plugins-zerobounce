(function($) {
    'use strict';

    $(function() {

        $('#validate-form').prop('disabled', false);

        let tooltipelements = document.querySelectorAll("[data-bs-toggle='tooltip']");
        tooltipelements.forEach((el) => {
            new bootstrap.Tooltip(el);
        });
        
        if ($("#zb-current-credits").length > 0) {
            $.ajax({
                    data: {
                        'action': 'zerobounce_current_credits',
                        'nonce': params.ajax_current_credits_nonce
                    },
                    dataType: 'json',
                    url: params.ajax_url,
                    type: 'POST',
                })
                .done(function(response) {
                    $("#zb-current-credits").text(response.data);
                })
                .fail(function(jqXHR, textStatus) {
                    console.log(jqXHR.responseJSON.data.reason);
                })
                .always(function() {
                    $("#zb-current-credits-loader").remove();
                });
        }

        $('#validate-form').submit(function(event) {
            event.preventDefault();

            var ajax_form_data = $("#validate-form").serializeArray();

            $('#submit').prop('disabled', true);
            $('#submit').val("Please wait...");

            $.ajax({
                    data: {
                        'action': 'zerobounce_validate_email_test',
                        'email': ajax_form_data[0].value,
                        'nonce': params.ajax_validation_nonce
                    },
                    dataType: 'json',
                    url: params.ajax_url,
                    type: 'POST',
                })
                .done(function(response) {
                    $('#validate-form-result .text-danger').text('');
                    if ($("#verifyEmailResult").length === 0) {
                        $('#validate-form-result').append(`<table id="verifyEmailResult">
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td>Status</td>
                                <td id="verifyEmailStatus">${response.data.status}</td>
                            </tr>
                            <tr>
                                <td>Sub-Status</td>
                                <td id="verifyEmailSubStatus">${response.data.sub_status}</td>
                            </tr>
                            <tr>
                                <td>Free Email</td>
                                <td id="verifyEmailFreeEmail">${response.data.free_email}</td>
                            </tr>
                            <tr>
                                <td>Did you mean?</td>
                                <td id="verifyEmailDyM">${response.data.did_you_mean}</td>
                            </tr>
                            <tr>
                                <td>Account</td>
                                <td id="verifyEmailAccount">${response.data.account}</td>
                            </tr>
                            <tr>
                                <td>Domain</td>
                                <td id="verifyEmailDomain">${response.data.domain}</td>
                            </tr>
                            <tr>
                                <td>Domain Age</td>
                                <td id="verifyEmailDomainAge">${response.data.domain_age_days} (days)</td>
                            </tr>
                            <tr>
                                <td>SMTP Provider</td>
                                <td id="verifyEmailSmtpProvider">${response.data.smtp_provider}</td>
                            </tr>
                            <tr>
                                <td>MX Found</td>
                                <td id="verifyEmailMxFound">${response.data.mx_found}</td>
                            </tr>
                            <tr>
                                <td>MX Record</td>
                                <td id="verifyEmailMxRecord">${response.data.mx_record}</td>
                            </tr>
                            <tr>
                                <td>Firstname</td>
                                <td id="verifyEmailFirstname">${response.data.firstname}</td>
                            </tr>
                            <tr>
                                <td>Lastname</td>
                                <td id="verifyEmailLastname">${response.data.lastname}</td>
                            </tr>
                            <tr>
                                <td>Gender</td>
                                <td id="verifyEmailGender">${response.data.gender}</td>
                            </tr>
                            <tr>
                                <td>Country</td>
                                <td id="verifyEmailCountry">${response.data.country}</td>
                            </tr>
                            <tr>
                                <td>Region</td>
                                <td id="verifyEmailRegion">${response.data.region}</td>
                            </tr>
                            <tr>
                                <td>City</td>
                                <td id="verifyEmailCity">${response.data.city}</td>
                            </tr>
                            <tr>
                                <td>ZIP Code</td>
                                <td id="verifyEmailZipCode">${response.data.zipcode}</td>
                            </tr>
                            <tr>
                                <td>Processed At</td>
                                <td id="verifyEmailProcessedAt">${response.data.processed_at}</td>
                            </tr>
                        </tbody>
                    </table>`);
                    } else {
                        $("#verifyEmailStatus").text(response.data.status);
                        $("#verifyEmailSubStatus").text(response.data.sub_status);
                        $("#verifyEmailFreeEmail").text(response.data.free_email);
                        $("#verifyEmailDyM").text(response.data.did_you_mean);
                        $("#verifyEmailAccount").text(response.data.account);
                        $("#verifyEmailDomain").text(response.data.domain);
                        $("#verifyEmailDomainAge").text(response.data.domain_age_days);
                        $("#verifyEmailSmtpProvider").text(response.data.smtp_provider);
                        $("#verifyEmailMxFound").text(response.data.mx_found);
                        $("#verifyEmailMxRecord").text(response.data.mx_record);
                        $("#verifyEmailFirstname").text(response.data.firstname);
                        $("#verifyEmailLastname").text(response.data.lastname);
                        $("#verifyEmailGender").text(response.data.gender);
                        $("#verifyEmailCountry").text(response.data.country);
                        $("#verifyEmailRegion").text(response.data.region);
                        $("#verifyEmailCity").text(response.data.city);
                        $("#verifyEmailZipCode").text(response.data.zipcode);
                        $("#verifyEmailProcessedAt").text(response.data.processed_at);
                    }
                })
                .fail(function(jqXHR, textStatus) {
                    $('#validate-form-result .text-danger').text(jqXHR.responseJSON.data.reason);})
                .always(function() {
                    event.target.reset();
                    $('#submit').val("Validate");
                    $('#submit').prop('disabled', false);
                });
        });

        if ($("#verifyEmailsChart").length > 0) {
            var validationsOptions = {
                colors: ['#3ecf8f', '#e65849', '#ff978a', '#ffbe43', '#dcdcdc', '#014b70', '#1e8bc2', '#030637'],
                series: [
                    {
                        name: 'Valid',
                        data: [],
                    },
                    {
                        name: 'Invalid',
                        data: [],
                    },
                    {
                        name: 'Catch-All',
                        data: [],
                    },
                    {
                        name: 'Unknown',
                        data: [],
                    },
                    {
                        name: 'Spamtrap',
                        data: [],
                    },
                    {
                        name: 'Abuse',
                        data: [],
                    },
                    {
                        name: 'Do Not Mail',
                        data: [],
                    },
                    {
                        name: 'Block Free Services',
                        data: [],
                    }
                ],
                chart: {
                    height: 350,
                    type: 'area',
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'smooth'
                },
                xaxis: {
                    type: 'datetime',
                    categories: [],
                    labels: {}
                },
                tooltip: {
                    x: {},
                },

                title: {
                    text: 'Validations this month:',
                    align: 'left',
                    floating: false,
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        fontFamily: undefined,
                        color: '#263238'
                    },
                },
                subtitle: {
                    text: 'Each type of validation status returned by the ZeroBounce API',
                    align: 'left',
                },
            };

            $.ajax({
                    data: {
                        'action': 'zerobounce_validation_logs',
                        'nonce': params.ajax_validation_charts_nonce
                    },
                    dataType: 'json',
                    url: params.ajax_url,
                    type: 'POST',
                })
                .done(function(response) {

                    var grand_total = 0;

                    $.each(response.data.count, function(index, value) {

                        validationsOptions.xaxis.categories.push(value.date);

                        validationsOptions.series[0].data.push(value.valid);
                        validationsOptions.series[1].data.push(value.invalid);
                        validationsOptions.series[2].data.push(value.catchall);
                        validationsOptions.series[3].data.push(value.unknown);
                        validationsOptions.series[4].data.push(value.spamtrap);
                        validationsOptions.series[5].data.push(value.abuse);
                        validationsOptions.series[6].data.push(value.do_not_mail);
                        validationsOptions.series[7].data.push(value.no_free_service);

                        if (value.total !== 0)
                            grand_total += value.total;
                    });

                    var validationsChart = new ApexCharts(document.querySelector("#verifyEmailsChart"), validationsOptions);
                    validationsChart.render();

                    validationsChart.updateOptions({
                        title: {
                            text: 'Validations this month: ' + grand_total,
                        }
                    });
                })
                .fail(function(jqXHR, textStatus) {
                    console.log(jqXHR.responseJSON.data.reason);
                })
                .always(function() {});
        }

        if ($("#creditUsageChart").length > 0) {
            var creditUsageOptions = {
                series: [{
                    name: "Credits",
                    data: []
                }],
                chart: {
                    type: 'area',
                    height: 350,
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                stroke: {
                    curve: 'straight'
                },

                title: {
                    text: 'Credits used this month: ',
                    align: 'left',
                    floating: false,
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                        fontFamily: undefined,
                        color: '#263238'
                    },
                },
                subtitle: {
                    text: 'A credit is used for each validation done using the ZeroBounce API',
                    align: 'left'
                },
                labels: [],
                xaxis: {
                    type: 'datetime',
                },
                yaxis: {
                    opposite: true
                },
                legend: {
                    horizontalAlign: 'left'
                }
            };

            $.ajax({
                    data: {
                        'action': 'zerobounce_credit_usage_logs',
                        'nonce': params.ajax_credit_usage_charts_nonce
                    },
                    dataType: 'json',
                    url: params.ajax_url,
                    type: 'POST',
                })
                .done(function(response) {

                    var grand_total = 0;

                    $.each(response.data.count, function(index, value) {

                        creditUsageOptions.labels.push(value.date);

                        creditUsageOptions.series[0].data.push(value.credits_used);

                        if (value.credits_used !== 0)
                            grand_total += value.credits_used;
                    });

                    var creditUsageChart = new ApexCharts(document.querySelector("#creditUsageChart"), creditUsageOptions);
                    creditUsageChart.render();

                    creditUsageChart.updateOptions({
                        title: {
                            text: 'Credits used this month: ' + grand_total,
                        }
                    });
                })
                .fail(function(jqXHR, textStatus) {
                    console.log(jqXHR.responseJSON.data.reason);
                })
                .always(function() {});
        }

        if ($("#logsTable").length > 0) {
            var table = $('#logsTable').DataTable({
                ajax: params.ajax_url,
                processing: true,
                serverSide: false,
                responsive: true,
                ajax: {
                    url: params.ajax_url,
                    data: {
                        'action': 'zerobounce_validation_full_logs',
                        'nonce': params.ajax_validation_full_logs_nonce
                    },
                },
                columnDefs: [{
                    targets: 7,
                    data: null,
                    defaultContent: '<button type="button" class="btn btn-info text-white">View</button>',
                }, ],
                columns: [{
                        data: 'id'
                    },
                    {
                        data: 'source'
                    },
                    {
                        data: 'email'
                    },
                    {
                        data: 'status'
                    },
                    {
                        data: 'sub_status'
                    },
                    {
                        data: 'ip_address'
                    },
                    {
                        data: 'date_time'
                    },
                ],
                order: [
                    [6, 'desc']
                ],
                "language": {
                    "processing": "<div class=\"spinner-border\" role=\"status\"><span class=\"visually-hidden\">Loading...</span></div>"
                }
            });

            new $.fn.dataTable.FixedHeader(table);

            $('#logsTable tbody').on('click', 'button', function() {
                var data = table.row($(this).parents('tr')).data();

                $.ajax({
                        data: {
                            'action': 'zerobounce_validation_single_log',
                            'id': data.id,
                            'nonce': params.ajax_validation_single_log_nonce
                        },
                        dataType: 'json',
                        url: params.ajax_url,
                        type: 'POST',
                    })
                    .done(function(response) {

                        if ($("#logInspectResult").length === 0) {
                            $('#log-inspect-result').append(`<table id="logInspectResult" class="table table-sm table-hover">
                                <thead></thead>
                                <tbody>
                                    <tr>
                                        <td>Status</td>
                                        <td id="logInspectStatus">${response.data.status}</td>
                                    </tr>
                                    <tr>
                                        <td>Sub-Status</td>
                                        <td id="logInspectSubStatus">${response.data.sub_status}</td>
                                    </tr>
                                    <tr>
                                        <td>Free Email</td>
                                        <td id="logInspectFreeEmail">${response.data.free_email}</td>
                                    </tr>
                                    <tr>
                                        <td>Did you mean?</td>
                                        <td id="logInspectDyM">${response.data.did_you_mean}</td>
                                    </tr>
                                    <tr>
                                        <td>Account</td>
                                        <td id="logInspectAccount">${response.data.account}</td>
                                    </tr>
                                    <tr>
                                        <td>Domain</td>
                                        <td id="logInspectDomain">${response.data.domain}</td>
                                    </tr>
                                    <tr>
                                        <td>Domain Age</td>
                                        <td id="logInspectDomainAge">${response.data.domain_age_days} (days)</td>
                                    </tr>
                                    <tr>
                                        <td>SMTP Provider</td>
                                        <td id="logInspectSmtpProvider">${response.data.smtp_provider}</td>
                                    </tr>
                                    <tr>
                                        <td>MX Found</td>
                                        <td id="logInspectMxFound">${response.data.mx_found}</td>
                                    </tr>
                                    <tr>
                                        <td>MX Record</td>
                                        <td id="logInspectMxRecord">${response.data.mx_record}</td>
                                    </tr>
                                    <tr>
                                        <td>Firstname</td>
                                        <td id="logInspectFirstname">${response.data.firstname}</td>
                                    </tr>
                                    <tr>
                                        <td>Lastname</td>
                                        <td id="logInspectLastname">${response.data.lastname}</td>
                                    </tr>
                                    <tr>
                                        <td>Gender</td>
                                        <td id="logInspectGender">${response.data.gender}</td>
                                    </tr>
                                    <tr>
                                        <td>Country</td>
                                        <td id="logInspectCountry">${response.data.country}</td>
                                    </tr>
                                    <tr>
                                        <td>Region</td>
                                        <td id="logInspectRegion">${response.data.region}</td>
                                    </tr>
                                    <tr>
                                        <td>City</td>
                                        <td id="logInspectCity">${response.data.city}</td>
                                    </tr>
                                    <tr>
                                        <td>ZIP Code</td>
                                        <td id="logInspectZipCode">${response.data.zipcode}</td>
                                    </tr>
                                    <tr>
                                        <td>Processed At</td>
                                        <td id="logInspectProcessedAt">${response.data.processed_at}</td>
                                    </tr>
                                </tbody>
                            </table>`);
                        } else {
                            $("#logInspectStatus").text(response.data.status);
                            $("#logInspectSubStatus").text(response.data.sub_status);
                            $("#logInspectFreeEmail").text(response.data.free_email);
                            $("#logInspectDyM").text(response.data.did_you_mean);
                            $("#logInspectAccount").text(response.data.account);
                            $("#logInspectDomain").text(response.data.domain);
                            $("#logInspectDomainAge").text(response.data.domain_age_days);
                            $("#logInspectSmtpProvider").text(response.data.smtp_provider);
                            $("#logInspectMxFound").text(response.data.mx_found);
                            $("#logInspectMxRecord").text(response.data.mx_record);
                            $("#logInspectFirstname").text(response.data.firstname);
                            $("#logInspectLastname").text(response.data.lastname);
                            $("#logInspectGender").text(response.data.gender);
                            $("#logInspectCountry").text(response.data.country);
                            $("#logInspectRegion").text(response.data.region);
                            $("#logInspectCity").text(response.data.city);
                            $("#logInspectZipCode").text(response.data.zipcode);
                            $("#logInspectProcessedAt").text(response.data.processed_at);
                        }

                        $("#logInspectModalLabel").text(`ZeroBounce Log #${data.id}`);

                        $("#logInspectModal").modal('show');
                    })
                    .fail(function(jqXHR, textStatus) {
                        console.log(jqXHR.responseJSON.data.reason);
                    })
                    .always(function() {});
            });
        }
    });



})(jQuery);