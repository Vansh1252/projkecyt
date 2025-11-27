import React from 'react'
import { Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer'
import { join } from 'path'
import { getImageBase64 } from '../utils'
import Footer from '../footer'

const pxToPt = (px: number) => px / 1.333

const siteLogo = join(process.cwd(), 'src', 'images', 'Site-logo.png')
const arrowPath = join(process.cwd(), 'src', 'images', 'arrow.png')

const styles = StyleSheet.create({
  page: {
    position: 'relative',
    overflow: 'hidden',
  },

  logo: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: pxToPt(90), // Example: 90px → 67.5pt
    marginBottom: pxToPt(122), // Example: 122px → 91.5pt
  },

  logoImg: {
    width: pxToPt(301), // 301px → 225.75pt
    height: pxToPt(75), // 75px → 56.25pt
    objectFit: 'contain',
  },

  titleBand: {
    backgroundColor: '#E5E7EB',
    padding: pxToPt(50), // 50px → 37.5pt
    textAlign: 'center',
    marginBottom: pxToPt(80),
  },

  title: {
    fontSize: pxToPt(32),
    fontWeight: 700,
    marginBottom: pxToPt(28),
  },

  metaRow: {
    flexDirection: 'column',
    gap: pxToPt(6), // 6px → ~4.5pt
  },

  metaItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: pxToPt(8), // 8px → 6pt
    marginBottom: pxToPt(4), // 4px → 3pt
  },

  metaLabel: {
    fontSize: pxToPt(16), // 16px → 12pt
    fontWeight: 700,
    color: '#1F2023',
  },

  metaValue: {
    fontSize: pxToPt(16),
    color: '#1F2023',
  },

  arrowWrapper: {
    position: 'absolute',
    width: pxToPt(800),
    height: pxToPt(537),
    bottom: 0,
    left: 0,
  },

  arrowImg: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain',
    objectPosition: 'center bottom',
  },
})

export default function Pdf_page1() {
  return (
    <Page size='A4' style={styles.page}>
      <View style={styles.logo}>
        <Image style={styles.logoImg} src={getImageBase64(siteLogo)} />
      </View>

      {/* START PAGE CONTENT BODY */}
      <View style={styles.titleBand}>
        <Text style={styles.title}>Your Intelligent Finance Proposal</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Prepared for:</Text>
            <Text style={styles.metaValue}>Yunchen Corporation Ltd</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Date:</Text>
            <Text style={styles.metaValue}>18 November 2025</Text>
          </View>

          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Prepared by:</Text>
            <Text style={styles.metaValue}>Sanay</Text>
          </View>
        </View>
      </View>

      <View style={styles.arrowWrapper}>
        <Image style={styles.arrowImg} src={getImageBase64(arrowPath)} />
      </View>

      {/* START FOOTER */}
      <Footer />
    </Page>
  )
}
