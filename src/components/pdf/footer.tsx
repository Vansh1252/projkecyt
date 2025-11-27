import { View, StyleSheet, Text } from '@react-pdf/renderer'
const pxToPt = (px: number) => px / 1.333

const styles = StyleSheet.create({
  page: {
    position: 'relative',
  },

  footer: {
    fontSize: pxToPt(13),
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    color: '#1F2023',
    paddingHorizontal: pxToPt(32),
  },
  footerInner: {
    fontSize: pxToPt(13),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #AFAFAF',
    paddingVertical: pxToPt(16),
  },
})

export default function Footer() {
  return (
    <View style={styles.footer}>
      <View style={styles.footerInner}>
        <Text>Sanay - Intelligent Bookkeeping & Finance Solutions</Text>
        <Text>www.sanaybpo.com</Text>
      </View>
    </View>
  )
}
