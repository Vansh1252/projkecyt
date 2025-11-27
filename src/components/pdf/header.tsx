import { View, Image, StyleSheet, Text } from '@react-pdf/renderer'
import { join } from 'path'
import { getImageBase64 } from './utils'

const pxToPt = (px: number) => px / 1.333

const logoPath = join(process.cwd(), 'src', 'images', 'Site-logo.png')

const styles = StyleSheet.create({
  page: {
    position: 'relative',
  },

  // HEADER
  header: {
    width: '100%',
    textAlign: 'center',
    color: '#1F2023',
    fontSize: pxToPt(16),
    paddingHorizontal: pxToPt(32),
  },

  logo: {
    width: pxToPt(121),
    height: pxToPt(31),
  },

  container: {
    fontSize: pxToPt(13),
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #AFAFAF',
    paddingVertical: pxToPt(16),
  },
})

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <Image style={styles.logo} src={getImageBase64(logoPath)} />
        <Text>2</Text>
      </View>
    </View>
  )
}
