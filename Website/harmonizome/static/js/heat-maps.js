/* Utility functions for the analytics page.
 * -----------------------------------------
 */

HARMONIZOME.heatMaps = (function() {

    var URL_BASE = 'api/1.0/visualize/heat_map/',
        $HEAT_MAP = $('.heat-map'),
        $HEAT_MAP_WRAPPER = $('#heat-map-wrapper');

    function setupIndividualDatasetHeatMapsPage(heatMapType) {
        $('select').change(function(evt) {
            var elem = $(evt.target).find(':selected'),
                encoded = encodeURIComponent(elem.text());

            if (elem.text() === '(Please select a dataset)') {
                emptyVisualization();
                return;
            }

            $.ajax({
                url: URL_BASE + heatMapType + "/" + encoded + '?type=' + heatMapType,
                type: 'GET',
                success: function(data) {
                    showDatasetHeatMap(JSON.parse(data));
                }
            });
        });
    }

    function setupDatasetPairHeatMapsPage() {

        var selectMsg = '(Please select a dataset)';

        $('select').eq(0).change(function(evt) {
            var ds1 = $(evt.target).find(':selected').text();
            if (ds1 === selectMsg) {
                $('#dataset-2').empty().parent().addClass('hidden');
                emptyVisualization();
                return;
            }
            $.ajax({
                url: 'api/1.0/visualize/heat_map/util/' + encodeURIComponent(ds1),
                method: 'GET',
                success: function(data) {
                    buildRightSelect(JSON.parse(data)['rightDatasets']);
                }
            });
        });

        $('button').click(function() {
            var ds1Text = $('select#dataset-1').find(':selected').text(),
                ds2Text = $('select#dataset-2').find(':selected').text(),
                ds1Val = encodeURIComponent(ds1Text),
                ds2Val = encodeURIComponent(ds2Text);

            if (ds1Text === selectMsg) {
                alert('Please select two datasets.');
                return;
            }

            $.ajax({
                url: URL_BASE + "dataset_pair/" + ds1Val + '/' + ds2Val,
                type: 'GET',
                success: function(data) {
                    var modifiedData = JSON.parse(data);
                    modifiedData.dataset1 = ds1Text;
                    modifiedData.dataset2 = ds2Text;
                    showDatasetPairVisualization(modifiedData);
                }
            });
        });
    }

    function buildRightSelect(datasets) {
        var $select = $('#dataset-2').empty();
        $.each(datasets, function(i, obj) {
            $select.append('<option>' + obj + '</option>');
        });
        $select.parent().removeClass('hidden');
    }

    function pluralize(attribute) {
        if (attribute === 'protein complex') {
            return attribute + 'es';
        }
        return attribute + 's';
    }

    function getIframeOrImage(data) {
        var image;
        if (typeof data.clustergrammerLink !== 'undefined') {
            return '<iframe src="' + data.clustergrammerLink + '"></iframe>';
        } else {
            image = data.imageLink || 'https://placeholdit.imgix.net/~text?txtsize=13&w=930&h=733';
            return '<img class="img-responsive" src="' + image + '"/>';
        }
    }

    function getLabelsIfNecessary(data, isPair) {
        var hasClustergrammerLink = typeof data.clustergrammerLink !== 'undefined';
        if (!isPair) {
            if (hasClustergrammerLink) {
                return '';
            } else {
                return '' +
                    '<div class="heat-map-header">' +
                    '   <p><em>No interactive hierarchical clustering is available at this time.</em></p>' +
                    '   <p><strong>' + data.colLabel + '</strong></p>' +
                    '   <p>compared with</p>' +
                    '   <p><strong>' + data.rowLabel + '</strong></p>' +
                    '</div>';
            }
        } else {
            if (hasClustergrammerLink) {
                return '';
            } else {
                return '' +
                    '<div class="heat-map-header">' +
                    '   <p>' + pluralize(data.attributeType1) + ' from</p>' +
                    '   <p><strong>' + data.dataset1 + '</strong></p>' +
                    '   <p>compared with</p>' +
                    '   <p>' + pluralize(data.attributeType2) + ' from</p>' +
                    '   <p><strong>' + data.dataset2 + '</strong></p>' +
                    '</div>';
            }
        }

    }

    function showDatasetHeatMap(data) {
    	$HEAT_MAP
            .hide()
            .empty()
            .append(
                $(getLabelsIfNecessary(data, false) + getIframeOrImage(data))
            )
            .fadeIn();
    }

    function showDatasetPairVisualization(data) {
    	$HEAT_MAP
            .hide()
            .empty()
            .append(
                getLabelsIfNecessary(data, true) + getIframeOrImage(data)
            )
            .fadeIn();
    }

    /* On dataset pages, show Clustergrammer when user clicks preview image.
     */
    var clickedHeatMap = [];
    function setupVisualizationsOnDatasetPages() {
        $('.dataset-page .heat-maps').click(function(evt) {
            var $img = $(evt.target),
                baseUrl = $img.attr('data-heat-map-url'),
                type = $img.attr('data-heat-map-type'),
                dataset = encodeURIComponent($img.attr('data-heat-map-dataset')),
                $clustergrammerWrapper = $('.clustergrammer-wrapper');

            if (clickedHeatMap[0] === type) {
                emptyVisualization();
                clickedHeatMap[0] = undefined;
                return;
            } else {
                clickedHeatMap[0] = type;
            }

            $.ajax({
                url: baseUrl + "/" + type + "/" + dataset,
                method: 'GET',
                success: function(data) {
                    data = JSON.parse(data);
                    showDatasetHeatMap(data);
                }
            });
        });
    }
    
    /* On heat map with input genes page, handles submit the form to the API.
     */
    function setupHeatMapWithInputGenesPage() {
    	$('#submit-btn').click(function(evt) {
    		evt.preventDefault();
    		emptyVisualization();
    		
    		var loader = LoadingScreen('Please wait...'),
    			genes = $('textarea').val().trim().split('\n'),
    			dataset = $('select').val(),
    			promise;

    		loader.start();    		
    		if (genes.length == 1 && genes[0] === '') {
    			loader.stop();
    			alert('No genes. Please input a few genes.');
    			return;
    		}
    		if (genes.length > 500) {
    			loader.stop();
    			alert('Too many genes. Please input 500 or fewer genes.');
    			return;
    		}
    		if (dataset == '(Please select a dataset)') {
    			loader.stop();
    			alert('No dataset selected.');
    			return;
    		}

    		promise = $.post(URL_BASE + 'input_genes', {
            	'dataset': dataset,
            	'genes': genes,
            });
    		promise.done(function(data) {
    			loader.stop();
            	var data = JSON.parse(data);
            	data.clustergrammerLink = data.link;
            	data.colLabel = 'columns';
            	data.rowLabel = 'rows';
            	showHeatMapLink(data);
            	showDatasetHeatMap(data);
            });
    		
    		promise.fail(function() {
    			loader.stop();
    			alert('Unknown error. Please contact the Ma\'ayan Lab');
    		});
    	});
    	
    	$('#example-btn').click(function(evt) {
    		evt.preventDefault();
    		// First 500 genes from Enrichr's example list.
    		var genes = ['NSUN3', 'POLRMT', 'NLRX1', 'SFXN5', 'ZC3H12C', 'SLC25A39', 'ARSG', 'DEFB29', 'NDUFB6', 'ZFAND1', 'TMEM77', '5730403B10RIK', 'RP23-195K8.6', 'TLCD1', 'PSMC6', 'SLC30A6', 'LOC100047292', 'LRRC40', 'ORC5L', 'MPP7', 'UNC119B', 'PRKACA', 'TCN2', 'PSMC3IP', 'PCMTD2', 'ACAA1A', 'LRRC1', '2810432D09RIK', 'SEPHS2', 'SAC3D1', 'TMLHE', 'LOC623451', 'TSR2', 'PLEKHA7', 'GYS2', 'ARHGEF12', 'HIBCH', 'LYRM2', 'ZBTB44', 'ENTPD5', 'RAB11FIP2', 'LIPT1', 'INTU', 'ANXA13', 'KLF12', 'SAT2', 'GAL3ST2', 'VAMP8', 'FKBPL', 'AQP11', 'TRAP1', 'PMPCB', 'TM7SF3', 'RBM39', 'BRI3', 'KDR', 'ZFP748', 'NAP1L1', 'DHRS1', 'LRRC56', 'WDR20A', 'STXBP2', 'KLF1', 'UFC1', 'CCDC16', '9230114K14RIK', 'RWDD3', '2610528K11RIK', 'ACO1', 'CABLES1', 'LOC100047214', 'YARS2', 'LYPLA1', 'KALRN', 'GYK', 'ZFP787', 'ZFP655', 'RABEPK', 'ZFP650', '4732466D17RIK', 'EXOSC4', 'WDR42A', 'GPHN', '2610528J11RIK', '1110003E01RIK', 'MDH1', '1200014M14RIK', 'AW209491', 'MUT', '1700123L14RIK', '2610036D13RIK', 'COX15', 'TMEM30A', 'NSMCE4A', 'TM2D2', 'RHBDD3', 'ATXN2', 'NFS1', '3110001I20RIK', 'BC038156', 'LOC100047782', '2410012H22RIK', 'RILP', 'A230062G08RIK', 'PTTG1IP', 'RAB1', 'AFAP1L1', 'LYRM5', '2310026E23RIK', 'C330002I19RIK', 'ZFYVE20', 'POLI', 'TOMM70A', 'SLC7A6OS', 'MAT2B', '4932438A13RIK', 'LRRC8A', 'SMO', 'NUPL2', 'TRPC2', 'ARSK', 'D630023B12RIK', 'MTFR1', '5730414N17RIK', 'SCP2', 'ZRSR1', 'NOL7', 'C330018D20RIK', 'IFT122', 'LOC100046168', 'D730039F16RIK', 'SCYL1', '1700023B02RIK', '1700034H14RIK', 'FBXO8', 'PAIP1', 'TMEM186', 'ATPAF1', 'LOC100046254', 'LOC100047604', 'COQ10A', 'FN3K', 'SIPA1L1', 'SLC25A16', 'SLC25A40', 'RPS6KA5', 'TRIM37', 'LRRC61', 'ABHD3', 'GBE1', 'PARP16', 'HSD3B2', 'ESM1', 'DNAJC18', 'DOLPP1', 'LASS2', 'WDR34', 'RFESD', 'CACNB4', '2310042D19RIK', 'SRR', 'BPNT1', '6530415H11RIK', 'CLCC1', 'TFB1M', '4632404H12RIK', 'D4BWG0951E', 'MED14', 'ADHFE1', 'THTPA', 'CAT', 'ELL3', 'AKR7A5', 'MTMR14', 'TIMM44', 'SF1', 'IPP', 'IAH1', 'TRIM23', 'WDR89', 'GSTZ1', 'CRADD', '2510006D16RIK', 'FBXL6', 'LOC100044400', 'ZFP106', 'CD55', '0610013E23RIK', 'AFMID', 'TMEM86A', 'ALDH6A1', 'DALRD3', 'SMYD4', 'NME7', 'FARS2', 'TASP1', 'CLDN10', 'A930005H10RIK', 'SLC9A6', 'ADK', 'RBKS', '2210016F16RIK', 'VWCE', '4732435N03RIK', 'ZFP11', 'VLDLR', '9630013D21RIK', '4933407N01RIK', 'FAHD1', 'MIPOL1', '1810019D21RIK', '1810049H13RIK', 'TFAM', 'PAICS', '1110032A03RIK', 'LOC100044139', 'DNAJC19', 'BC016495', 'A930041I02RIK', 'RQCD1', 'USP34', 'ZCCHC3', 'H2AFJ', 'PHF7', '4921508D12RIK', 'KMO', 'PRPF18', 'MCAT', 'TXNDC4', '4921530L18RIK', 'VPS13B', 'SCRN3', 'TOR1A', 'AI316807', 'ACBD4', 'FAH', 'APOOL', 'COL4A4', 'LRRC19', 'GNMT', 'NR3C1', 'SIP1', 'ASCC1', 'FECH', 'ABHD14A', 'ARHGAP18', '2700046G09RIK', 'YME1L1', 'GK5', 'GLO1', 'SBK1', 'CISD1', '2210011C24RIK', 'NXT2', 'NOTUM', 'ANKRD42', 'UBE2E1', 'NDUFV1', 'SLC33A1', 'CEP68', 'RPS6KB1', 'HYI', 'ALDH1A3', 'MYNN', '3110048L19RIK', 'RDH14', 'PROZ', 'GORASP1', 'LOC674449', 'ZFP775', '5430437P03RIK', 'NPY', 'ADH5', 'SYBL1', '4930432O21RIK', 'NAT9', 'LOC100048387', 'METTL8', 'ENY2', '2410018G20RIK', 'PGM2', 'FGFR4', 'MOBKL2B', 'ATAD3A', '4932432K03RIK', 'DHTKD1', 'UBOX5', 'A530050D06RIK', 'ZDHHC5', 'MGAT1', 'NUDT6', 'TPMT', 'WBSCR18', 'LOC100041586', 'CDK5RAP1', '4833426J09RIK', 'MYO6', 'CPT1A', 'GADD45GIP1', 'TMBIM4', '2010309E21RIK', 'ASB9', '2610019F03RIK', '7530414M10RIK', 'ATP6V1B2', '2310068J16RIK', 'DDT', 'KLHDC4', 'HPN', 'LIFR', 'OVOL1', 'NUDT12', 'CDAN1', 'FBXO9', 'FBXL3', 'HOXA7', 'ALDH8A1', '3110057O12RIK', 'ABHD11', 'PSMB1', 'ENSMUSG00000074286', 'CHPT1', 'OXSM', '2310009A05RIK', '1700001L05RIK', 'ZFP148', '39509', 'MRPL9', 'TMEM80', '9030420J04RIK', 'NAGLU', 'PLSCR2', 'AGBL3', 'PEX1', 'CNO', 'NEO1', 'ASF1A', 'TNFSF5IP1', 'PKIG', 'AI931714', 'D130020L05RIK', 'CNTD1', 'CLEC2H', 'ZKSCAN1', '1810044D09RIK', 'METTL7A', 'SIAE', 'FBXO3', 'FZD5', 'TMEM166', 'TMED4', 'GPR155', 'RNF167', 'SPTLC1', 'RIOK2', 'TGDS', 'PMS1', 'PITPNC1', 'PCSK7', '4933403G14RIK', 'EI24', 'CREBL2', 'TLN1', 'MRPL35', '2700038C09RIK', 'UBIE', 'OSGEPL1', '2410166I05RIK', 'WDR24', 'AP4S1', 'LRRC44', 'B3BP', 'ITFG1', 'DMXL1', 'C1DNSUN3', 'POLRMT', 'NLRX1', 'SFXN5', 'ZC3H12C', 'SLC25A39', 'ARSG', 'DEFB29', 'NDUFB6', 'ZFAND1', 'TMEM77', '5730403B10RIK', 'RP23-195K8.6', 'TLCD1', 'PSMC6', 'SLC30A6', 'LOC100047292', 'LRRC40', 'ORC5L', 'MPP7', 'UNC119B', 'PRKACA', 'TCN2', 'PSMC3IP', 'PCMTD2', 'ACAA1A', 'LRRC1', '2810432D09RIK', 'SEPHS2', 'SAC3D1', 'TMLHE', 'LOC623451', 'TSR2', 'PLEKHA7', 'GYS2', 'ARHGEF12', 'HIBCH', 'LYRM2', 'ZBTB44', 'ENTPD5', 'RAB11FIP2', 'LIPT1', 'INTU', 'ANXA13', 'KLF12', 'SAT2', 'GAL3ST2', 'VAMP8', 'FKBPL', 'AQP11', 'TRAP1', 'PMPCB', 'TM7SF3', 'RBM39', 'BRI3', 'KDR', 'ZFP748', 'NAP1L1', 'DHRS1', 'LRRC56', 'WDR20A', 'STXBP2', 'KLF1', 'UFC1', 'CCDC16', '9230114K14RIK', 'RWDD3', '2610528K11RIK', 'ACO1', 'CABLES1', 'LOC100047214', 'YARS2', 'LYPLA1', 'KALRN', 'GYK', 'ZFP787', 'ZFP655', 'RABEPK', 'ZFP650', '4732466D17RIK', 'EXOSC4', 'WDR42A', 'GPHN', '2610528J11RIK', '1110003E01RIK', 'MDH1', '1200014M14RIK', 'AW209491', 'MUT', '1700123L14RIK', '2610036D13RIK', 'COX15', 'TMEM30A', 'NSMCE4A', 'TM2D2', 'RHBDD3', 'ATXN2', 'NFS1', '3110001I20RIK', 'BC038156', 'LOC100047782', '2410012H22RIK', 'RILP', 'A230062G08RIK', 'PTTG1IP', 'RAB1', 'AFAP1L1', 'LYRM5', '2310026E23RIK', 'C330002I19RIK', 'ZFYVE20', 'POLI', 'TOMM70A', 'SLC7A6OS', 'MAT2B', '4932438A13RIK', 'LRRC8A', 'SMO', 'NUPL2', 'TRPC2', 'ARSK', 'D630023B12RIK', 'MTFR1', '5730414N17RIK', 'SCP2', 'ZRSR1'];
    		$('textarea').val(genes.join('\n'));
    		$("select").val('BioGPS Human Cell Type and Tissue Gene Expression Profiles');
    	});
    }
    
    function showHeatMapLink(data) {
    	$HEAT_MAP_WRAPPER.show().find('.heat-map-link').text(data.link);
    }

    function emptyVisualization() {
    	$HEAT_MAP_WRAPPER.hide();
    	$HEAT_MAP.empty();
    }
   
    function LoadingScreen(message) {
        var $body = $('body'),
            $el = $('' +
                '<div class="loader-container">' +
                    '<div class="loader-modal">' + message + '</div>' +
                '</div>'
            );
        return {
            start: function() {
                $body.append($el);
            },
            stop: function() {
                $el.remove();
            }
        };
    }
    
    return {
    	setupDatasetPairHeatMapsPage: setupDatasetPairHeatMapsPage,
    	setupVisualizationsOnDatasetPages: setupVisualizationsOnDatasetPages,
    	setupIndividualDatasetHeatMapsPage: setupIndividualDatasetHeatMapsPage,
    	setupHeatMapWithInputGenesPage: setupHeatMapWithInputGenesPage
    };
})();