
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  background: "#080808",
  sidebar: "#0D0D0D",
  surface: "#141414",
  surfaceHover: "#1B1B1B",
  border: "#262626",
  red: "#D71920",
  redDark: "#991B1B",
  white: "#F5F5F5",
  text: "#D0D0D0",
  muted: "#777777",
};

const FONT = {
  regular: "AlteHaasGrotesk",
  bold: "AlteHaasGroteskBold",
  italic: "AlteHaasGroteskItalic",
};

const INITIAL_CHAT = {
  id: "welcome",
  title: "Nova conversa",
  messages: [],
};

const SUGGESTIONS = [
  {
    icon: "code-slash-outline",
    title: "Programar",
    description: "Criar e corrigir códigos",
    prompt: "Quero ajuda para programar.",
  },
  {
    icon: "bulb-outline",
    title: "Ter ideias",
    description: "Explorar possibilidades",
    prompt: "Ajude-me a desenvolver uma ideia.",
  },
  {
    icon: "document-text-outline",
    title: "Escrever",
    description: "Textos claros e objetivos",
    prompt: "Ajude-me a escrever um texto.",
  },
  {
    icon: "school-outline",
    title: "Aprender",
    description: "Entender assuntos complexos",
    prompt: "Quero aprender um assunto novo.",
  },
];

function AppText({
  children,
  style,
  weight = "regular",
  italic = false,
  ...props
}) {
  return (
    <Text
      {...props}
      style={[
        {
          color: COLORS.white,
          fontFamily: italic
            ? FONT.italic
            : weight === "bold"
            ? FONT.bold
            : FONT.regular,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

function IconButton({ name, onPress, size = 20, color = COLORS.text, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[styles.iconButton, style]}
      accessibilityRole="button"
    >
      <Ionicons name={name} size={size} color={color} />
    </TouchableOpacity>
  );
}

export default function App() {
  const [chats, setChats] = useState([INITIAL_CHAT]);
  const [activeId, setActiveId] = useState("welcome");
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const activeChat =
    chats.find((chat) => chat.id === activeId) || chats[0];

  function createChat() {
    const chat = {
      id: String(Date.now()),
      title: "Nova conversa",
      messages: [],
    };

    setChats((previous) => [chat, ...previous]);
    setActiveId(chat.id);
    setInput("");
    setSettingsOpen(false);
  }

  function sendMessage(text = input) {
    const message = text.trim();
    if (!message) return;

    const userMessage = {
      id: String(Date.now()),
      role: "user",
      content: message,
    };

    setChats((previous) =>
      previous.map((chat) => {
        if (chat.id !== activeId) return chat;

        const firstMessage = chat.messages.length === 0;

        return {
          ...chat,
          title: firstMessage
            ? message.slice(0, 30) +
              (message.length > 30 ? "..." : "")
            : chat.title,
          messages: [
            ...chat.messages,
            userMessage,
            {
              id: String(Date.now() + 1),
              role: "assistant",
              content:
                "Sua mensagem foi recebida pela interface do VexAI. Para gerar respostas inteligentes de verdade, precisamos conectar um modelo de IA por meio de um serviço seguro.",
            },
          ],
        };
      })
    );

    setInput("");
  }

  function selectChat(id) {
    setActiveId(id);
    setSettingsOpen(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      <View style={styles.app}>
        {sidebarOpen && (
          <View style={styles.sidebar}>
            <View style={styles.brandRow}>
              <View style={styles.brandMark}>
                <AppText weight="bold" style={styles.brandV}>
                  V
                </AppText>
              </View>
              <View style={{ flex: 1 }}>
                <AppText weight="bold" style={styles.brandName}>
                  Vex<Text style={{ color: COLORS.red }}>AI</Text>
                </AppText>
                <AppText style={styles.brandCaption}>
                  INTELLIGENCE, REFINED
                </AppText>
              </View>
              <IconButton
                name="chevron-back-outline"
                size={19}
                onPress={() => setSidebarOpen(false)}
              />
            </View>

            <TouchableOpacity
              style={styles.newChatButton}
              onPress={createChat}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={21} color="#FFFFFF" />
              <AppText weight="bold" style={styles.newChatText}>
                Nova conversa
              </AppText>
              <View style={{ flex: 1 }} />
              <Ionicons name="create-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>

            <AppText style={styles.sectionLabel}>RECENTES</AppText>

            <ScrollView
              style={styles.chatList}
              showsVerticalScrollIndicator={false}
            >
              {chats.map((chat) => (
                <TouchableOpacity
                  key={chat.id}
                  onPress={() => selectChat(chat.id)}
                  style={[
                    styles.chatItem,
                    activeId === chat.id && styles.chatItemActive,
                  ]}
                >
                  <Ionicons
                    name="chatbubble-outline"
                    size={17}
                    color={
                      activeId === chat.id
                        ? COLORS.white
                        : COLORS.muted
                    }
                  />
                  <AppText
                    numberOfLines={1}
                    style={[
                      styles.chatTitle,
                      activeId === chat.id && styles.activeChatTitle,
                    ]}
                  >
                    {chat.title}
                  </AppText>
                  {activeId === chat.id && (
                    <View style={styles.activeDot} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.sidebarBottom}>
              <View style={styles.sidebarDivider} />
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => setSettingsOpen(!settingsOpen)}
              >
                <Ionicons
                  name="settings-outline"
                  size={19}
                  color={COLORS.text}
                />
                <AppText style={styles.menuText}>Configurações</AppText>
                <View style={{ flex: 1 }} />
                <Ionicons
                  name={settingsOpen ? "chevron-up" : "chevron-forward"}
                  size={16}
                  color={COLORS.muted}
                />
              </TouchableOpacity>
              <View style={styles.profileRow}>
                <View style={styles.avatar}>
                  <AppText weight="bold" style={{ fontSize: 14 }}>
                    V
                  </AppText>
                </View>
                <View style={{ flex: 1 }}>
                  <AppText weight="bold" style={{ fontSize: 13 }}>
                    Meu espaço
                  </AppText>
                  <AppText style={styles.profileCaption}>
                    VexAI · Pessoal
                  </AppText>
                </View>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={20}
                  color={COLORS.muted}
                />
              </View>
            </View>
          </View>
        )}

        <View style={styles.main}>
          <View style={styles.topbar}>
            {!sidebarOpen && (
              <IconButton
                name="menu-outline"
                onPress={() => setSidebarOpen(true)}
                size={23}
              />
            )}

            <View style={styles.topbarTitle}>
              <AppText weight="bold" style={styles.topTitle}>
                {settingsOpen ? "Configurações" : "VexAI"}
              </AppText>
              <View style={styles.statusDot} />
              <AppText style={styles.statusText}>Preview</AppText>
            </View>

            <IconButton
              name="create-outline"
              onPress={createChat}
              size={21}
            />
          </View>

          {settingsOpen ? (
            <ScrollView contentContainerStyle={styles.settingsContent}>
              <AppText weight="bold" style={styles.pageHeading}>
                Preferências
              </AppText>
              <AppText style={styles.pageDescription}>
                Personalize sua experiência no VexAI.
              </AppText>

              <View style={styles.settingsCard}>
                <Ionicons
                  name="color-palette-outline"
                  size={22}
                  color={COLORS.red}
                />
                <View style={{ flex: 1 }}>
                  <AppText weight="bold">Aparência</AppText>
                  <AppText style={styles.settingsDescription}>
                    Tema escuro · Preto e vermelho
                  </AppText>
                </View>
                <Ionicons
                  name="checkmark-circle"
                  size={21}
                  color={COLORS.red}
                />
              </View>

              <View style={styles.settingsCard}>
                <Ionicons
                  name="text-outline"
                  size={22}
                  color={COLORS.red}
                />
                <View style={{ flex: 1 }}>
                  <AppText weight="bold">Tipografia</AppText>
                  <AppText style={styles.settingsDescription}>
                    Alte Haas Grotesk
                  </AppText>
                </View>
              </View>

              <View style={styles.settingsCard}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={22}
                  color={COLORS.red}
                />
                <View style={{ flex: 1 }}>
                  <AppText weight="bold">Privacidade</AppText>
                  <AppText style={styles.settingsDescription}>
                    A conexão com serviços externos ainda não está ativa.
                  </AppText>
                </View>
              </View>
            </ScrollView>
          ) : (
            <>
              <ScrollView
                key={activeId}
                style={styles.conversation}
                contentContainerStyle={styles.conversationContent}
                showsVerticalScrollIndicator={false}
              >
                {activeChat.messages.length === 0 ? (
                  <View style={styles.welcome}>
                    <View style={styles.welcomeIcon}>
                      <View style={styles.welcomeIconInner}>
                        <AppText weight="bold" style={styles.welcomeV}>
                          V
                        </AppText>
                      </View>
                    </View>

                    <AppText style={styles.eyebrow}>
                      YOUR AI, YOUR SPACE
                    </AppText>

                    <AppText weight="bold" style={styles.welcomeTitle}>
                      Inteligência sem{"\n"}
                      <Text style={{ color: COLORS.red }}>
                        complicação.
                      </Text>
                    </AppText>

                    <AppText style={styles.welcomeDescription}>
                      O que vamos criar, descobrir ou resolver hoje?
                    </AppText>

                    <View style={styles.suggestions}>
                      {SUGGESTIONS.map((item) => (
                        <TouchableOpacity
                          key={item.title}
                          style={styles.suggestionCard}
                          onPress={() => sendMessage(item.prompt)}
                          activeOpacity={0.75}
                        >
                          <View style={styles.suggestionIcon}>
                            <Ionicons
                              name={item.icon}
                              size={19}
                              color={COLORS.red}
                            />
                          </View>
                          <AppText
                            weight="bold"
                            style={styles.suggestionTitle}
                          >
                            {item.title}
                          </AppText>
                          <AppText style={styles.suggestionDescription}>
                            {item.description}
                          </AppText>
                          <View style={styles.suggestionArrow}>
                            <Ionicons
                              name="arrow-up-outline"
                              size={16}
                              color={COLORS.muted}
                            />
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                ) : (
                  <View style={styles.messages}>
                    {activeChat.messages.map((message) => (
                      <View key={message.id} style={styles.messageBlock}>
                        <View style={styles.messageHeader}>
                          <View
                            style={[
                              styles.messageAvatar,
                              message.role === "assistant" &&
                                styles.aiAvatar,
                            ]}
                          >
                            {message.role === "assistant" ? (
                              <AppText
                                weight="bold"
                                style={{ color: COLORS.red }}
                              >
                                V
                              </AppText>
                            ) : (
                              <Ionicons
                                name="person-outline"
                                size={16}
                                color={COLORS.text}
                              />
                            )}
                          </View>
                          <AppText weight="bold" style={styles.messageAuthor}>
                            {message.role === "assistant" ? "VexAI" : "Você"}
                          </AppText>
                        </View>
                        <AppText style={styles.messageText}>
                          {message.content}
                        </AppText>
                      </View>
                    ))}
                  </View>
                )}
              </ScrollView>

              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
              >
                <View style={styles.composerArea}>
                  <View style={styles.composer}>
                    <TextInput
                      value={input}
                      onChangeText={setInput}
                      placeholder="Pergunte qualquer coisa..."
                      placeholderTextColor="#686868"
                      multiline
                      maxLength={5000}
                      style={styles.input}
                      selectionColor={COLORS.red}
                      onSubmitEditing={() => sendMessage()}
                      blurOnSubmit={false}
                    />
                    <View style={styles.composerBottom}>
                      <AppText style={styles.composerHint}>
                        VexAI · Modo demonstração
                      </AppText>
                      <TouchableOpacity
                        onPress={() => sendMessage()}
                        disabled={!input.trim()}
                        style={[
                          styles.sendButton,
                          !input.trim() && styles.sendButtonDisabled,
                        ]}
                        activeOpacity={0.8}
                      >
                        <Ionicons
                          name="arrow-up"
                          size={20}
                          color="#FFFFFF"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <AppText style={styles.disclaimer}>
                    A IA pode cometer erros. Confira informações importantes.
                  </AppText>
                </View>
              </KeyboardAvoidingView>
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  app: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: COLORS.background,
  },
  sidebar: {
    width: 265,
    backgroundColor: COLORS.sidebar,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 3,
    paddingBottom: 24,
  },
  brandMark: {
    width: 37,
    height: 37,
    borderRadius: 11,
    backgroundColor: "#211011",
    borderWidth: 1,
    borderColor: "#542024",
    alignItems: "center",
    justifyContent: "center",
  },
  brandV: {
    color: COLORS.red,
    fontSize: 24,
  },
  brandName: {
    fontSize: 20,
    letterSpacing: -0.8,
  },
  brandCaption: {
    color: COLORS.muted,
    fontSize: 8,
    letterSpacing: 1.3,
    marginTop: 2,
  },
  iconButton: {
    width: 37,
    height: 37,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  newChatButton: {
    minHeight: 45,
    borderRadius: 10,
    backgroundColor: COLORS.red,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 9,
    marginBottom: 27,
  },
  newChatText: {
    fontSize: 13,
  },
  sectionLabel: {
    color: "#676767",
    fontSize: 10,
    letterSpacing: 1.5,
    marginLeft: 8,
    marginBottom: 10,
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 41,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 10,
    marginBottom: 3,
  },
  chatItemActive: {
    backgroundColor: COLORS.surfaceHover,
    borderWidth: 1,
    borderColor: "#2D2D2D",
  },
  chatTitle: {
    color: "#A0A0A0",
    fontSize: 12,
    flex: 1,
  },
  activeChatTitle: {
    color: COLORS.white,
  },
  activeDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.red,
  },
  sidebarBottom: {
    paddingTop: 8,
  },
  sidebarDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    minHeight: 43,
    paddingHorizontal: 8,
  },
  menuText: {
    color: COLORS.text,
    fontSize: 12,
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 5,
    paddingVertical: 12,
    marginTop: 5,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: "#252525",
    alignItems: "center",
    justifyContent: "center",
  },
  profileCaption: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 3,
  },
  main: {
    flex: 1,
    minWidth: 0,
    backgroundColor: COLORS.background,
  },
  topbar: {
    minHeight: 57,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#1B1B1B",
  },
  topbarTitle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingLeft: 7,
  },
  topTitle: {
    fontSize: 14,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#777777",
  },
  statusText: {
    color: COLORS.muted,
    fontSize: 11,
  },
  conversation: {
    flex: 1,
  },
  conversationContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 18,
    paddingVertical: 35,
  },
  welcome: {
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
    alignItems: "center",
  },
  welcomeIcon: {
    width: 63,
    height: 63,
    borderRadius: 22,
    backgroundColor: "#180D0E",
    borderWidth: 1,
    borderColor: "#452023",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },
  welcomeIconInner: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "#241012",
    alignItems: "center",
    justifyContent: "center",
  },
  welcomeV: {
    color: COLORS.red,
    fontSize: 29,
  },
  eyebrow: {
    color: COLORS.red,
    fontSize: 10,
    letterSpacing: 2.5,
    marginBottom: 15,
  },
  welcomeTitle: {
    fontSize: 35,
    lineHeight: 42,
    letterSpacing: -1.3,
    textAlign: "center",
  },
  welcomeDescription: {
    color: "#929292",
    fontSize: 13,
    lineHeight: 21,
    textAlign: "center",
    marginTop: 13,
    marginBottom: 29,
    maxWidth: 300,
  },
  suggestions: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  suggestionCard: {
    width: "48%",
    flexGrow: 1,
    minWidth: 120,
    minHeight: 132,
    padding: 13,
    borderRadius: 13,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  suggestionIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: "#251012",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 13,
  },
  suggestionTitle: {
    fontSize: 13,
    marginBottom: 5,
  },
  suggestionDescription: {
    color: "#858585",
    fontSize: 10,
    lineHeight: 15,
  },
  suggestionArrow: {
    position: "absolute",
    right: 10,
    top: 12,
  },
  messages: {
    width: "100%",
    maxWidth: 680,
    alignSelf: "center",
    paddingVertical: 8,
  },
  messageBlock: {
    marginBottom: 28,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  messageAvatar: {
    width: 29,
    height: 29,
    borderRadius: 10,
    backgroundColor: "#202020",
    alignItems: "center",
    justifyContent: "center",
  },
  aiAvatar: {
    backgroundColor: "#211011",
    borderWidth: 1,
    borderColor: "#482023",
  },
  messageAuthor: {
    fontSize: 13,
  },
  messageText: {
    color: "#D0D0D0",
    fontSize: 14,
    lineHeight: 23,
    paddingLeft: 39,
  },
  composerArea: {
    paddingHorizontal: 13,
    paddingTop: 10,
    paddingBottom: 7,
  },
  composer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#353535",
    backgroundColor: "#121212",
    paddingHorizontal: 13,
    paddingTop: 12,
    paddingBottom: 9,
  },
  input: {
    minHeight: 36,
    maxHeight: 110,
    color: COLORS.white,
    fontFamily: FONT.regular,
    fontSize: 14,
    lineHeight: 21,
    paddingTop: 3,
    paddingBottom: 6,
  },
  composerBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  composerHint: {
    color: "#777777",
    fontSize: 10,
  },
  sendButton: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: COLORS.red,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#492123",
    opacity: 0.75,
  },
  disclaimer: {
    color: "#666666",
    textAlign: "center",
    fontSize: 9,
    marginTop: 10,
    marginBottom: 2,
  },
  settingsContent: {
    padding: 22,
    gap: 13,
  },
  pageHeading: {
    fontSize: 25,
    marginBottom: 4,
  },
  pageDescription: {
    color: "#909090",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 13,
  },
  settingsCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    padding: 16,
    borderRadius: 13,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingsDescription: {
    color: "#929292",
    fontSize: 11,
    lineHeight: 17,
    marginTop: 5,
  },
});
