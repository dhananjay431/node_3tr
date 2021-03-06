var gulp = require('gulp'),
concat = require('gulp-concat'),
gulpCopy = require('gulp-copy'),
livereload = require('gulp-livereload');
gulp.task('vendor', function() {
  return gulp.src([
'./js/jquery-1.8.3.js',
'./js/ui/jquery-ui-1.9.2.custom.js',
'./js/skdslider.js',
'./js/jquery.jqplot.min.js',
'./js/plugins/jqplot.logAxisRenderer.min.js',
'./js/plugins/jqplot.canvasTextRenderer.min.js',
'./js/plugins/jqplot.canvasAxisLabelRenderer.min.js',
'./js/plugins/jqplot.canvasAxisTickRenderer.min.js',
'./js/plugins/jqplot.dateAxisRenderer.min.js',
'./js/plugins/jqplot.categoryAxisRenderer.min.js',
'./js/plugins/jqplot.barRenderer.min.js',
'./js/plugins/jqplot.cursor.min.js',
'./js/plugins/jqplot.highlighter.min.js',
'./js/plugins/jqplot.pointLabels.min.js',
'./js/flot/excanvas.min.js',
'./js/flot/jquery.flot.js',
'./js/flot/jquery.flot.pie.min.js',
'./js/flot/jquery.flot.resize.js',
'./js/flot/jquery.flot.orderBars.js',
'./js/formWizard/jquery.form.js',
'./js/formWizard/jquery.validate.js',
'./js/formWizard/bbq.js',
'./js/formWizard/jquery.form.wizard.js',
'./js/scrollbar/jquery.mCustomScrollbar.js',
'./js/fullcalendar/fullcalendar.js',
'./js/tipsy/jquery.tipsy.js',
'./js/fancybox/jquery.fancybox.pack.js',
'./js/uniform/jquery.uniform.js',
'./js/dataTable/jquery.dataTables.js',
'./js/sparklines/jquery.sparkline.js',
'./js/chosen/chosen.jquery.js',
'./js/cookie/jquery.cookie.js',
'./js/jplayer/jquery.jplayer.min.js',
'./js/mask/jquery.maskedinput-1.3.js',
'./js/easypiechart/jquery.easy-pie-chart.js',
'./js/globalize/globalize.js',
'./js/globalize/cultures/globalize.culture.de.js',
'./js/jplayer/jquery.jplayer.min.js',
'./js/jplayer/jplayer.playlist.min.js',
'./js/ibutton/jquery.ibutton.js',
'./js/dateRangepicker/date.js',
'./js/dateRangepicker/daterangepicker.jQuery.js',
'./js/antiscroll/jquery-mousewheel.js',
'./js/antiscroll/antiscroll.js',
'./js/bootstrap.min.js',
'./js/application.js',
'./js/general.js',
'./js/forms.js',
'./js/dashboard.js'
    ])
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./public/js/'));
});
gulp.task('default', ['vendor']);
