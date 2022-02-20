<template>
  <f7-page>
    <f7-navbar :title="$t('404.title')" back-link="Back"></f7-navbar>

    <f7-block class="text-align-center">
      <p>
        <i class="f7-icons if-ios" style="font-size: 100pt"
          >exclamationmark_triangle</i
        >
        <i class="material-icons if-not-ios" style="font-size: 100pt"
          >report_problem</i
        >
      </p>
      <p>{{$t('404.pagenotfound')}}</p>
    </f7-block>
  </f7-page>
</template>
<script>
export default {};
</script>