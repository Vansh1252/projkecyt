import React from 'react'
import { Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import Footer from '../footer'
import Header from '../header'

const pxToPt = (px: number) => px / 1.333

const styles = StyleSheet.create({
  page: {
    position: 'relative',
    overflow: 'hidden',
  },

  container: {
    width: '100%',
    padding: pxToPt(32),
  },

  secHead: {
    marginBottom: pxToPt(20),
  },

  titleH2: {
    ontSize: pxToPt(28),
    fontWeight: 700,
    marginBottom: pxToPt(12),
  },

  titleH3: {
    ontSize: pxToPt(24),
    fontWeight: 700,
    marginBottom: pxToPt(12),
  },

  titleP: {
    fontSize: pxToPt(16),
    color: '#1F2023',
    lineHeight: '160%',
  },

  resultWrap: {
    marginTop: pxToPt(60),
  },

  borderBox: {
    padding: pxToPt(16),
    border: '1px solid #D1D5DB',
    borderRadius: pxToPt(8),
  },

  listWrap: {
    width: '100%',
  },

  listItem: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: pxToPt(16),
  },

  bold: {
    fontWeight: 'bold',
  },
})

export default function Pdf_page2() {
  return (
    <Page size='A4' style={styles.page}>
      {/* START HEADER */}
      <Header />

      {/* START PAGE CONTENT BODY */}
      <View style={styles.container}>
        <View style={styles.secHead}>
          <Text style={styles.titleH2}>Executive Summary</Text>
          <Text style={styles.titleP}>
            This proposal outlines a comprehensive, intelligent finance solution
            tailored specifically for Acme Corporation Ltd.
          </Text>
        </View>

        <Text style={styles.titleP}>
          Based on the information you provided — including your business size
          (approx. £500,000 revenue), current setup (In-house bookkeeping with
          part-time accountant), and the services selected — this proposal
          outlines how Sanay’s Intelligent Finance Solution can help you
          automate, simplify, and strengthen your finance operations.
        </Text>

        <View style={styles.resultWrap}>
          <View style={styles.secHead}>
            <Text style={styles.titleH3}>Your Results Snapshot</Text>
          </View>
          <View style={styles.borderBox}>
            <View style={styles.listWrap}>
              <View style={styles.listItem}>
                <Text style={styles.titleP}>
                  Total Monthly Investment (Sanay)
                </Text>
                <Text style={styles.titleP}>
                  <Text style={styles.bold}>£850</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* START FOOTER */}
      <Footer />
    </Page>
  )
}
