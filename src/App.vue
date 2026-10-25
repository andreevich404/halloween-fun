<script setup lang="ts">
import { MotionConfig } from 'motion-v'
import GhostGame from './components/GhostGame.vue'
import HeroSection from './components/HeroSection.vue'
import PumpkinBuilder from './components/PumpkinBuilder.vue'
import PumpkinOracle from './components/PumpkinOracle.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'
</script>

<template>
  <MotionConfig reduced-motion="user">
    <SiteHeader />
    <main>
      <HeroSection />
      <GhostGame />
      <PumpkinOracle />
      <PumpkinBuilder />
    </main>
    <SiteFooter />
  </MotionConfig>
</template>
