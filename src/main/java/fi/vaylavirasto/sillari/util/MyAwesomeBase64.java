package fi.vaylavirasto.sillari.util;

import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class MyAwesomeBase64 {
    private MyAwesomeBase64() {
    }




    public static Decoder getDecoder() {
        return Decoder.RFC4648;
    }





    public static class Decoder {
        private final boolean isURL;
        private final boolean isMIME;
        private static final int[] fromBase64 = new int[256];
        private static final int[] fromBase64URL;
        static final Decoder RFC4648;
        static final Decoder RFC4648_URLSAFE;
        static final Decoder RFC2045;

        private Decoder(boolean isURL, boolean isMIME) {
            this.isURL = isURL;
            this.isMIME = isMIME;
        }

        public byte[] decode(byte[] src) {
            byte[] dst = new byte[this.outLength(src, 0, src.length)];
            int ret = this.decode0(src, 0, src.length, dst);
            if (ret != dst.length) {
                dst = Arrays.copyOf(dst, ret);
            }

            return dst;
        }

        public byte[] decode(String src) {
            return this.decode(src.getBytes(StandardCharsets.US_ASCII));
        }





        private int outLength(byte[] src, int sp, int sl) {
            int[] base64 = this.isURL ? fromBase64URL : fromBase64;
            int paddings = 0;
            int len = sl - sp;
            if (len == 0) {
                return 0;
            } else if (len < 2) {
                if (this.isMIME && base64[0] == -1) {
                    return 0;
                } else {
                    throw new IllegalArgumentException("Input byte[] should at least have 2 bytes for base64 bytes");
                }
            } else {
                if (this.isMIME) {
                    int n = 0;

                    while (sp < sl) {
                        int b = src[sp++] & 255;
                        if (b == 61) {
                            len -= sl - sp + 1;
                            break;
                        }

                        if (base64[b] == -1) {
                            ++n;
                        }
                    }

                    len -= n;
                } else if (src[sl - 1] == 61) {
                    ++paddings;
                    if (src[sl - 2] == 61) {
                        ++paddings;
                    }
                }

                if (paddings == 0 && (len & 3) != 0) {
                    paddings = 4 - (len & 3);
                }

                return 3 * ((len + 3) / 4) - paddings;
            }
        }

        private int decode0(byte[] bytes, int currentWhatever,final int leghtn, byte[] decodedBytes) {
            int[] base64 = this.isURL ? fromBase64URL : fromBase64;
            int dp = 0;
            int bits = 0;
            int shiftto = 18;

            label85:
            while (currentWhatever < leghtn) {
                int b;
                if (shiftto == 18 && currentWhatever + 4 < leghtn) {
                    b = currentWhatever + (leghtn - currentWhatever & -4);

                    while (true) {
                        if (currentWhatever < b) {
                            int b1 = base64[bytes[currentWhatever++] & 255];
                            int b2 = base64[bytes[currentWhatever++] & 255];
                            int b3 = base64[bytes[currentWhatever++] & 255];
                            int b4 = base64[bytes[currentWhatever++] & 255];
                            if ((b1 | b2 | b3 | b4) >= 0) {
                                int bits0 = b1 << 18 | b2 << 12 | b3 << 6 | b4;
                                decodedBytes[dp++] = (byte) (bits0 >> 16);
                                decodedBytes[dp++] = (byte) (bits0 >> 8);
                                decodedBytes[dp++] = (byte) bits0;
                                continue;
                            }
                            log.debug("decodedBytes: " +decodedBytes);
                            currentWhatever -= 4;
                        }

                        if (currentWhatever >= leghtn) {
                            break label85;
                        }
                        break;
                    }
                }

                b = bytes[currentWhatever++] & 255;
                if ((b = base64[b]) >= 0) {
                    bits |= b << shiftto;
                    shiftto -= 6;
                    if (shiftto < 0) {
                        decodedBytes[dp++] = (byte) (bits >> 16);
                        decodedBytes[dp++] = (byte) (bits >> 8);
                        decodedBytes[dp++] = (byte) bits;
                        shiftto = 18;
                        bits = 0;
                    }
                } else {
                    if (b == -2) {
                        if (shiftto == 6 && (currentWhatever == leghtn || bytes[currentWhatever++] != 61) || shiftto == 18) {
                            throw new IllegalArgumentException("Input byte array has wrong 4-byte ending unit");
                        }
                        break;
                    }

                    if (!this.isMIME) {
                        throw new IllegalArgumentException("Illegal base64 character " + Integer.toString(bytes[currentWhatever - 1], 16));
                    }
                }
            }

            if (shiftto == 6) {
                decodedBytes[dp++] = (byte) (bits >> 16);
            } else if (shiftto == 0) {
                decodedBytes[dp++] = (byte) (bits >> 16);
                decodedBytes[dp++] = (byte) (bits >> 8);
            } else if (shiftto == 12) {
                throw new IllegalArgumentException("Last unit does not have enough valid bits");
            }

            do {
                if (currentWhatever >= leghtn) {
                    return dp;
                }
            } while (this.isMIME && base64[bytes[currentWhatever++] & 255] < 0);

            throw new IllegalArgumentException("Input byte array has incorrect ending byte at " + currentWhatever);
        }

        static {
            Arrays.fill(fromBase64, -1);

            int i;
            for (i = 0; i < Encoder.toBase64.length; fromBase64[Encoder.toBase64[i]] = i++) {
            }

            fromBase64[61] = -2;
            fromBase64URL = new int[256];
            Arrays.fill(fromBase64URL, -1);

            for (i = 0; i < Encoder.toBase64URL.length; fromBase64URL[Encoder.toBase64URL[i]] = i++) {
            }

            fromBase64URL[61] = -2;
            RFC4648 = new Decoder(false, false);
            RFC4648_URLSAFE = new Decoder(true, false);
            RFC2045 = new Decoder(false, true);
        }
    }

    public static class Encoder {
        private final byte[] newline;
        private final int linemax;
        private final boolean isURL;
        private final boolean doPadding;
        private static final char[] toBase64 = new char[]{'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '/'};
        private static final char[] toBase64URL = new char[]{'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '-', '_'};
        private static final int MIMELINEMAX = 76;
        private static final byte[] CRLF = new byte[]{13, 10};
        static final Encoder RFC4648 = new Encoder(false, (byte[]) null, -1, true);
        static final Encoder RFC4648_URLSAFE = new Encoder(true, (byte[]) null, -1, true);
        static final Encoder RFC2045;

        private Encoder(boolean isURL, byte[] newline, int linemax, boolean doPadding) {
            this.isURL = isURL;
            this.newline = newline;
            this.linemax = linemax;
            this.doPadding = doPadding;
        }

        private final int outLength(int srclen) {
            int len;
            if (this.doPadding) {
                len = 4 * ((srclen + 2) / 3);
            } else {
                int n = srclen % 3;
                len = 4 * (srclen / 3) + (n == 0 ? 0 : n + 1);
            }

            if (this.linemax > 0) {
                len += (len - 1) / this.linemax * this.newline.length;
            }

            return len;
        }

        public byte[] encode(byte[] src) {
            int len = this.outLength(src.length);
            byte[] dst = new byte[len];
            int ret = this.encode0(src, 0, src.length, dst);
            return ret != dst.length ? Arrays.copyOf(dst, ret) : dst;
        }

        public int encode(byte[] src, byte[] dst) {
            int len = this.outLength(src.length);
            if (dst.length < len) {
                throw new IllegalArgumentException("Output byte array is too small for encoding all input bytes");
            } else {
                return this.encode0(src, 0, src.length, dst);
            }
        }



        public ByteBuffer encode(ByteBuffer buffer) {
            int len = this.outLength(buffer.remaining());
            byte[] dst = new byte[len];
            int ret;
            if (buffer.hasArray()) {
                ret = this.encode0(buffer.array(), buffer.arrayOffset() + buffer.position(), buffer.arrayOffset() + buffer.limit(), dst);
                buffer.position(buffer.limit());
            } else {
                byte[] src = new byte[buffer.remaining()];
                buffer.get(src);
                ret = this.encode0(src, 0, src.length, dst);
            }

            if (ret != dst.length) {
                dst = Arrays.copyOf(dst, ret);
            }

            return ByteBuffer.wrap(dst);
        }



        public Encoder withoutPadding() {
            return !this.doPadding ? this : new Encoder(this.isURL, this.newline, this.linemax, false);
        }


        private void encodeBlock(byte[] src, int sp, int sl, byte[] dst, int dp, boolean isURL) {
            char[] base64 = isURL ? toBase64URL : toBase64;
            int sp0 = sp;

            int bits;
            for (int var9 = dp; sp0 < sl; dst[var9++] = (byte) base64[bits & 63]) {
                bits = (src[sp0++] & 255) << 16 | (src[sp0++] & 255) << 8 | src[sp0++] & 255;
                dst[var9++] = (byte) base64[bits >>> 18 & 63];
                dst[var9++] = (byte) base64[bits >>> 12 & 63];
                dst[var9++] = (byte) base64[bits >>> 6 & 63];
            }

        }

        private int encode0(byte[] src, int off, int end, byte[] dst) {
            char[] base64 = this.isURL ? toBase64URL : toBase64;
            int sp = off;
            int slen = (end - off) / 3 * 3;
            int sl = off + slen;
            if (this.linemax > 0 && slen > this.linemax / 4 * 3) {
                slen = this.linemax / 4 * 3;
            }

            int dp = 0;

            while (true) {
                int b0;
                int b1;
                do {
                    do {
                        if (sp >= sl) {
                            if (sp < end) {
                                b0 = src[sp++] & 255;
                                dst[dp++] = (byte) base64[b0 >> 2];
                                if (sp == end) {
                                    dst[dp++] = (byte) base64[b0 << 4 & 63];
                                    if (this.doPadding) {
                                        dst[dp++] = 61;
                                        dst[dp++] = 61;
                                    }
                                } else {
                                    b1 = src[sp++] & 255;
                                    dst[dp++] = (byte) base64[b0 << 4 & 63 | b1 >> 4];
                                    dst[dp++] = (byte) base64[b1 << 2 & 63];
                                    if (this.doPadding) {
                                        dst[dp++] = 61;
                                    }
                                }
                            }

                            return dp;
                        }

                        b0 = Math.min(sp + slen, sl);
                        this.encodeBlock(src, sp, b0, dst, dp, this.isURL);
                        b1 = (b0 - sp) / 3 * 4;
                        dp += b1;
                        sp = b0;
                    } while (b1 != this.linemax);
                } while (b0 >= end);

                byte[] var12 = this.newline;
                int var13 = var12.length;

                for (int var14 = 0; var14 < var13; ++var14) {
                    byte b = var12[var14];
                    dst[dp++] = b;
                }
            }
        }

        static {
            RFC2045 = new Encoder(false, CRLF, 76, true);
        }
    }
}
